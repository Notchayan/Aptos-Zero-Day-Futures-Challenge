# Starting server

enter your private key here 
module name 

```env
APTOS_NODE_URL="https://fullnode.devnet.aptoslabs.com/v1"
ACC_PRIV_KEY="0x384d72f2cefd49416d1af3c3b0a6f92dc737a27aebddcca46eac74480e74daad"
MOD_NAME_INSTRUMENT5001="Coin4"
MOD_NAME_INSTRUMENT5002="Coin4"
MOD_NAME_INSTRUMENT5003="Coin4"
MOD_NAME_INSTRUMENT6001="Coin4"
MOD_NAME_INSTRUMENT6002="Coin4"
MOD_NAME_INSTRUMENT6003="Coin4"
EXP_ORD_FUNC="expiryOrderBookNotMatch"
CHANGE_J_FUNC="changeJ"
MARKET_PRICE_FUNC="MarketPriceList"
PLACE_LIMIT_ORDER_FUNC="place_Order"
PLACE_MARKET_ORDER_FUNC="market_place_Order"
SELL_MARKET_PRICE ="SellOrder"
BUY_MARKET_PRICE ="BuyOrder"
```

Create `.env` file like above and then run the below code to start server.

```bash
pip3 install -r requirement.txt
python3 main.py
```

Your sever will start on `localhost:8000` by default.
