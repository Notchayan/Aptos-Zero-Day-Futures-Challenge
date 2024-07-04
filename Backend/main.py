from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from aptos import autoCall,MarketListData,placeMarketOrder, placeLimitOrder, BuyData, SellData, account
from market import GetRiskStats
from pydantic import BaseModel

scheduler = AsyncIOScheduler()
scheduler.add_job(autoCall,'cron',hour=23,minute=59)
scheduler.start()

app = FastAPI()
app.add_middleware(CORSMiddleware,allow_origins='*',)

InstrumentNumber = ["5001", "5002", "5003", "6001", "6002", "6003"];

data = {instrument: [] for instrument in InstrumentNumber}
MarketList = {instrument: [] for instrument in InstrumentNumber}
buydata = [{} for _ in range(len(InstrumentNumber))]
selldata = [0] * len(InstrumentNumber)
Upd = {instrument: [1, 1, 1] for instrument in InstrumentNumber}
coin_dict = {instrument: index for index, instrument in enumerate(InstrumentNumber)}
MarketListParse = []

class PlaceLimitOrderBody(BaseModel):
    InstrumentToken:str
    privKey:str
    amount:int
    price:int
    timestamp:int
    date:int
    side:bool
    leverage:int

class PlaceMarketOrderBody(BaseModel):
    InstrumentToken:str
    privKey:str
    amount:int
    timestamp:int
    date:int
    side:bool
    leverage:int

async def UpdateMarketList(InstrumentToken : str):
    global MarketList
    MarketList[InstrumentToken] = await MarketListData(InstrumentToken)

async def UpdateBuyMarket(InstrumentToken : str):
    global buydata
    buydata[coin_dict[InstrumentToken]] = await BuyData(InstrumentToken)

async def UpdateSellMarket(InstrumentToken : str):
    global selldata 
    selldata[coin_dict[InstrumentToken]] = await SellData(InstrumentToken)

@app.get('/')
async def root():
    return "success"

#Rist Manage
@app.get('/riskStat/{InstrumentToken}')
async def riskStat(InstrumentToken : str):
    if Upd[InstrumentToken][2] == 1: 
        await UpdateMarketList(InstrumentToken);
        Upd[InstrumentToken][2] = 0;
    prices = [int(entry["price"]) for entry in MarketList[InstrumentToken]]
    return GetRiskStats(list(map(int,prices)))

@app.get('/Orderplaced/{InstrumentToken}')
async def changeDirty(InstrumentToken : str):
    Upd[InstrumentToken][0] = 1;
    Upd[InstrumentToken][1] = 1;
    Upd[InstrumentToken][2] = 1;
    return {"Thank you to Place Your on the BLOCKCHAIN"}

@app.get('/BuyMarketPrice/{InstrumentToken}')
async def buymarket(InstrumentToken : str):
    if Upd[InstrumentToken][1] == 1 : 
        await UpdateBuyMarket(InstrumentToken);
        Upd[InstrumentToken][1] = 0;
    return {'BuyMarketPrice': buydata[coin_dict[InstrumentToken]]}

@app.get('/SellMarketPrice/{InstrumentToken}')
async def sellmarket(InstrumentToken : str):
    if Upd[InstrumentToken][0] == 1 : 
        await UpdateSellMarket(InstrumentToken);
        Upd[InstrumentToken][0] = 0;
    return {'SellMarketPrice': selldata[coin_dict[InstrumentToken]]}

@app.get('/MarketHistory/{InstrumentToken}')
async def MarketHistory(
    InstrumentToken: str,
):
    global MarketListParse
    if Upd[InstrumentToken][2] == 1:
        await UpdateMarketList(InstrumentToken)
        Upd[InstrumentToken][2] = 0
        MarketListParse = MarketList[InstrumentToken]
        for entry in MarketListParse:
            entry["timestamp"] = entry["timestamp"][:-2] + ":" + entry["timestamp"][-2:]
    return {'Market History List': MarketListParse}

@app.get('/MarketHistory/{InstrumentToken}/{first_timestamp}/{last_timestamp}')
async def view(InstrumentToken: str, first_timestamp: str, last_timestamp: str):
    if Upd[InstrumentToken][2] == 1:
        await UpdateMarketList(InstrumentToken)
        Upd[InstrumentToken][2] = 0
    first_timestamp_int = int(first_timestamp)
    last_timestamp_int = int(last_timestamp)
    filtered_data = [
        entry for entry in MarketList[InstrumentToken]
        if first_timestamp_int <= int(entry["timestamp"]) <= last_timestamp_int
    ]
    return {'data': filtered_data}

@app.post('/placeLimitOrder')
async def placeOrderHandler(InstrumentToken : str, plc:PlaceLimitOrderBody):
    await placeLimitOrder(InstrumentToken, plc.privKey,plc.amount,plc.price,plc.timestamp,plc.date,plc.side,plc.leverage)
    return "success"

@app.post('/placeMarketOrder')
async def placeOrderHandler(InstrumentToken : str, plc:PlaceMarketOrderBody):
    await placeMarketOrder(InstrumentToken, plc.privKey,plc.amount,plc.timestamp,plc.date,plc.side,plc.leverage)
    return "success"


if __name__ == '__main__':
    uvicorn.run("main:app",port=8000,reload=True)
