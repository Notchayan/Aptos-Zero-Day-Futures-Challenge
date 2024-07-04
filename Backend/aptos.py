from datetime import date
from dotenv import load_dotenv
import os
from aptos_sdk.account import Account
from aptos_sdk.async_client import RestClient
from aptos_sdk.transactions import TransactionPayload,EntryFunction,TransactionArgument
from aptos_sdk.bcs import Serializer

load_dotenv()

InstrumentNumber = ["5001", "5002", "5003", "6001", "6002", "6003"];

NODE_URL = os.getenv("APTOS_NODE_URL")
PRIV_KEY = os.getenv("ACC_PRIV_KEY")
EXP_ORD_FUNC = os.getenv("EXP_ORD_FUNC")
CHANGE_J_FUNC = os.getenv("CHANGE_J_FUNC")
MARKET_PRICE_FUNC = os.getenv("MARKET_PRICE_FUNC")
PLACE_MARKET_ORDER_FUNC = os.getenv("PLACE_MARKET_ORDER_FUNC")
PLACE_LIMIT_ORDER_FUNC = os.getenv("PLACE_LIMIT_ORDER_FUNC")
SELL_MARKET_PRICE = os.getenv("SELL_MARKET_PRICE")
BUY_MARKET_PRICE = os.getenv("BUY_MARKET_PRICE")

rest_client = RestClient(NODE_URL)
account = Account.load_key(PRIV_KEY)

InstrumentDictionary = {}

for instrument in InstrumentNumber:
    env_variable_name = f"MOD_NAME_INSTRUMENT{instrument}"
    InstrumentDictionary[instrument] = os.getenv(env_variable_name, f"DefaultNameFor{instrument}")

async def autoCall():
    '''this function runs 2 BCS transactions'''
    global InstrumentNumber
    for InstrumentToken in InstrumentNumber:
        trans_arg_1 = [TransactionArgument(date.today().day, Serializer.u64)]
        payload1 = TransactionPayload(
            EntryFunction.natural(
                f'{str(account.account_address)}::{InstrumentDictionary[InstrumentToken]}',
                f"{EXP_ORD_FUNC}",
                [],
                trans_arg_1
            )
        )
        payload2 = TransactionPayload(
            EntryFunction.natural(
                f'{str(account.account_address)}::{InstrumentDictionary[InstrumentToken]}',
                f'{CHANGE_J_FUNC}',
                [],
                []
            )
        )
        sign_trans_1 = await rest_client.create_bcs_signed_transaction(account, payload1)
        await rest_client.submit_bcs_transaction(sign_trans_1)
        sign_trans_2 = await rest_client.create_bcs_signed_transaction(account, payload2)
        await rest_client.submit_bcs_transaction(sign_trans_2)
    return 

async def MarketListData(InstrumentToken):
    '''this function returns data for risk calculation'''
    global InstrumentDictionary
    res = await rest_client.account_resource(account.account_address,f"{account.account_address}::{InstrumentDictionary[InstrumentToken]}::{MARKET_PRICE_FUNC}")
    return res['data']['data']


async def placeLimitOrder(InstrumentToken : str,privKey:str,amount:int,price:int,timestamp:int,date:int,side:bool,leverage:int):
    global InstrumentDictionary
    account = Account.load_key(privKey)
    trans_arg = [TransactionArgument(amount,Serializer.u64),TransactionArgument(price,Serializer.u64),TransactionArgument(timestamp,Serializer.u64),TransactionArgument(date,Serializer.u64),TransactionArgument(side,Serializer.bool),TransactionArgument(leverage,Serializer.u64)]
    payload = TransactionPayload(
        EntryFunction.natural(
            f'{str(account.account_address)}::{InstrumentDictionary[InstrumentToken]}',
            f"{PLACE_LIMIT_ORDER_FUNC}",
            [],
            trans_arg
        )
    )
    sign_trans = await rest_client.create_bcs_signed_transaction(account,payload)
    await rest_client.submit_bcs_transaction(sign_trans)
    return

async def placeMarketOrder(InstrumentToken : str,privKey:str,amount:int,timestamp:int,date:int,side:bool,leverage:int):
    global InstrumentDictionary
    account = Account.load_key(privKey)
    trans_arg = [TransactionArgument(amount,Serializer.u64),TransactionArgument(timestamp,Serializer.u64),TransactionArgument(date,Serializer.u64),TransactionArgument(side,Serializer.bool),TransactionArgument(leverage,Serializer.u64)]
    payload = TransactionPayload(
        EntryFunction.natural(
            f'{str(account.account_address)}::{InstrumentDictionary[InstrumentToken]}',
            f"{PLACE_MARKET_ORDER_FUNC}",
            [],
            trans_arg
        )
    )
    sign_trans = await rest_client.create_bcs_signed_transaction(account,payload)
    await rest_client.submit_bcs_transaction(sign_trans)
    return


async def SellData(InstrumentToken : str):
    global InstrumentDictionary
    res1 = await rest_client.account_resource(account.account_address,f"{account.account_address}::{InstrumentDictionary[InstrumentToken]}::{SELL_MARKET_PRICE}")
    orders = res1["data"]["orders"]
    non_zero_orders = [order for order in orders if int(order["amount"]) > 0]
    if not non_zero_orders:
        return 0
    lowest_price_order = min(non_zero_orders, key=lambda order: float(order["price"]))
    return {"Price": lowest_price_order["price"], "TimeStamp": lowest_price_order["timestamp"]}

async def BuyData(InstrumentToken : str):
    global InstrumentDictionary
    res2 = await rest_client.account_resource(account.account_address,f"{account.account_address}::{InstrumentDictionary[InstrumentToken]}::{BUY_MARKET_PRICE}")
    orders = res2["data"]["orders"]
    non_zero_orders = [order for order in orders if int(order["amount"]) > 0]
    if not non_zero_orders:
        return 0
    highest_price_order = max(non_zero_orders, key=lambda order: float(order["price"]))
    return {"Price": highest_price_order["price"], "TimeStamp": highest_price_order["timestamp"]}

