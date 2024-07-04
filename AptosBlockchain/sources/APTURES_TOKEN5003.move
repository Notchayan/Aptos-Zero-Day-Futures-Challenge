module resource_account::TOKEN5003{
    //imports
    use std::signer;
    use std::vector;
    use std::coin;
    use std::aptos_coin::AptosCoin; 
    use std::aptos_account;
    use aptos_framework::account;
    use std::debug::print; 
    //***Open It*****/
    // use std::aptos_coin;
    // use aptos_framework::resource_account;
    use std::simple_map::{SimpleMap,Self};
    use std::string::{utf8};

    
//Constants
    const E_NOT_OWNER: u64 = 0;
    const E_IS_NOT_INITIALIZED: u64 = 1;
    const E_ORDERS_COUNT_NOT_MATCHED: u64 = 2;
    const E_ORDERS_PRICE_NOT_MATCHED: u64 = 3;
    const E_NOT_ENOUGH_COINS:u64 =8;
    const E_HEAP_EMPTY: u64 = 9;


//Structs

    struct ModuleData has key {
        resource_signer_cap: account::SignerCapability,
    }
    
    struct Timestamp has key{
            deployed:u64
    }
    
    struct Order has store, drop, copy {
        index :u64,
        trader: address,
        amount: u64,
        price: u64,
        timestamp: u64,
        expiry_stamp: u64,
        side: bool,
        matched : bool,
        leverage: u64,
        liquidation_price: u64,
        n_days:u64,
    }

    struct BuyMap has key {
        maps:SimpleMap<u64,vector<Order>>
    }

    struct SellMap has key {
        maps:SimpleMap<u64,vector<Order>>
    }

    struct Person has store, drop, copy {
        addr: address,
        balance_token: u64,
    }

    struct BuyOrder has key {
        orders:vector<Order>,
        orders_counter: u64
    }

    struct SellOrder has key{
        orders:vector<Order>,
        orders_counter: u64
    }
    struct SuccessOrder has key {
        orders:vector<Order>,
        orders_counter: u64
    }

    struct Heap has key {
        data: vector<u64>,
    }

    struct Pair has store, drop, copy {
        price: u64,
        quantity: u64,
    }

    struct SellHeap has key {
        data: vector<Pair>,
    }

    struct BuyHeap has key {
        data: vector<Pair>,
    }

    struct MarketPrice has store, drop, copy, key {
        data: u64,
    }
    struct TotalSuccessOrder has key {
        orders:vector<Order>,
    }
    struct Pricetimepair has key, drop, store, copy {
        price : u64, 
        timestamp : u64,
    }
    struct MarketPriceList has store, drop, copy, key {
        data : vector<Pricetimepair>,
    }
    struct LastSuccess has key{
        price:u64
    }

 //Checks
    public fun assert_is_owner(addr: address) {
        assert!(addr == @resource_account, 0);  
    }   

    public fun assert_uninitialized(addr: address) {
        assert!(!exists<BuyOrder>(addr), 1);
        assert!(!exists<SellOrder>(addr), 1);
    }
     public fun assert_initialized(addr: address) {
        assert!(exists<BuyOrder>(addr), 1);
        assert!(exists<SellOrder>(addr), 1);
    }
    public fun assert_initialized_success(addr: address) {
        assert!(exists<SuccessOrder>(addr), 1);  
    }
     public fun differnceInTime(time : u64) : u64 acquires Timestamp{
        let addr=getOwner();
        let t2=borrow_global_mut<Timestamp>(addr);
        let deployed=t2.deployed;
        return time- deployed
    }

    //Functions

    fun init_module(acc: &signer){
        let addr = signer::address_of(acc);

        //UnComment It to use Resource Account ****************************

        // let resource_signer_cap = resource_account::retrieve_resource_account_cap(acc, @source_addr);

        // move_to(acc, ModuleData {
        //             resource_signer_cap
        //         });

        

        assert_is_owner(addr);
        assert_uninitialized(addr);

        let buyOrder = BuyOrder{
           orders:vector::empty<Order>(),
           orders_counter:0,
            };
        let sellOrder = SellOrder{
            orders:vector::empty<Order>(),
           orders_counter:0,
        };
        
        let buyMap= BuyMap{
            maps:simple_map::create(),
        };
 
        let sellMap= SellMap{
            maps:simple_map::create(),
        }; 

        let timeStamp=Timestamp{
            deployed:1,
        };

        let heap = Heap {
            data: vector::empty(),
        };


        let sellHeap = SellHeap {
            data: vector::empty<Pair>(),    
        };

        let buyHeap = BuyHeap {
            data : vector::empty<Pair>(),
        };

        let lastSuccess=LastSuccess{
            price: 0,
        };

        let marketprice = MarketPrice {
            data : 100,
        };
        let overallSuccessList=TotalSuccessOrder{
            orders:vector::empty<Order>(),
        };
        let marketpricelist = MarketPriceList{
            data : vector::empty<Pricetimepair>(),
        };

        //Transferring Ownerships

        move_to(acc, marketpricelist);
        move_to(acc, lastSuccess);
        move_to(acc,overallSuccessList);
        move_to(acc,heap);
        move_to(acc,sellHeap);
        move_to(acc,buyHeap);
        move_to(acc,marketprice);
        move_to(acc,timeStamp);
        move_to(acc,buyMap);
        move_to(acc,sellMap);
        move_to(acc, buyOrder);
        move_to(acc, sellOrder);    

    }

   //View Functions

        #[view]
    public fun check_order_liquidates(orderside: bool, orderliquidationprice: u64): bool acquires MarketPrice{
        let owner=getOwner();
        let marketPrice=borrow_global_mut<MarketPrice>(owner);
        
        if( orderside){
            if( marketPrice.data > orderliquidationprice){

                return true
            };
        }
        else{
            if( marketPrice.data < orderliquidationprice){
              
                return true
            };
        };
        return false
    }
    

    #[view]
     public fun countBuyOrder() : u64 acquires BuyOrder
    {
        let owner=getOwner();

        let buyorder=borrow_global_mut<BuyOrder>(owner); 
       let total_orders = vector::length(&buyorder.orders);
       return total_orders

    }

    #[view]
    public fun countSellOrder() : u64 acquires SellOrder
    {
        let owner=getOwner();

        let buyorder=borrow_global_mut<SellOrder>(owner); 
       let total_orders = vector::length(&buyorder.orders);
       return total_orders
    }

    #[view]
    public fun countSuccessOrder(trader : address) : u64 acquires TotalSuccessOrder
    {
       let buyorder=borrow_global_mut<TotalSuccessOrder>(trader); 
       let total_orders = vector::length(&buyorder.orders);
       return total_orders

    }

    #[view]
    public fun getBuyList():vector<Order> acquires BuyOrder{
        let owner=getOwner();
       let buyorder=borrow_global_mut<BuyOrder>(owner); 
        return buyorder.orders
    }

    #[view]
    public fun getSellList():vector<Order> acquires SellOrder{
        let owner=getOwner();
       let buyorder=borrow_global_mut<SellOrder>(owner); 
        return buyorder.orders
    }

    #[view]
    public fun getTotalSuccessList():vector<Order> acquires TotalSuccessOrder{
        let trader=getOwner();
        if(!exists<TotalSuccessOrder>(trader)){
           let vec=vector::empty<Order>();
           return vec
        };
       let buyorder=borrow_global_mut<TotalSuccessOrder>(trader); 
        return buyorder.orders
    }

    //To Ensure The Balance Of Resource Account
    #[view]
    public fun getBalanceResource():u64{
        let balance = coin::balance<AptosCoin>(@resource_account);
        return balance
    } 
    //For Owner To Fund The Resource Account
    public entry fun fundMyResource(acc:&signer,amount:u64){
        transferAmount(acc,@resource_account,amount*100000000);
    }

    //Gets the Current Price
    #[view]
    public fun getCurrentMarketPrice(): u64 acquires LastSuccess {
        let owner=getOwner();
        let marketprice = borrow_global_mut<LastSuccess>(owner);
        return marketprice.price
    }

    public fun liquidationLoop() acquires TotalSuccessOrder ,MarketPrice{
        let owner=getOwner();
        let successList=borrow_global_mut<TotalSuccessOrder>(owner);
        let length = vector::length(&successList.orders);
        let i=0;
        while(i < length){
            let order=vector::borrow(&successList.orders,i);
            if(check_order_liquidates(order.side,order.liquidation_price)){
                vector::remove(&mut successList.orders,i);
                length = length - 1;
            }
            else{
                i = i + 1;
            };
            
        };
    }
    //Resource Account Address
    public fun getOwner():address{
        return @resource_account
    }

    //Handles N-Day Expiry  
    public fun expiryOrderBookNotMatch(date:u64) acquires MarketPrice,Timestamp,Heap ,BuyMap,SellMap,BuyOrder,SellOrder,TotalSuccessOrder{
        let addr=getOwner();
        let t2=borrow_global_mut<Timestamp>(addr);
        let deployedDate=t2.deployed;
        if(date!=deployedDate){
            //Transfer Money Back To the Users
            // liquidateAll();
            let buyorder=borrow_global_mut<BuyOrder>(addr); 
            let sellorder=borrow_global_mut<SellOrder>(addr);    
            let buymap=borrow_global_mut<BuyMap>(addr);
            let sellmap=borrow_global_mut<SellMap>(addr);
            let heap=borrow_global_mut<Heap>(addr);

            //Need To empty This Or Not??????????????????????
            // let buyHeap=borrow_global_mut<BuyHeap>(addr);
            // let sellHeap=borrow_global_mut<SellHeap>(addr);
            // vector::trim(&mut buyHeap.data,0);
            // vector::trim(&mut sellHeap.data,0);


            vector::trim(&mut heap.data,0);
            buymap.maps=simple_map::new();
            sellmap.maps=simple_map::new();


            vector::trim(&mut buyorder.orders ,0);
            buyorder.orders_counter=0;

            vector::trim(&mut sellorder.orders ,0);
            sellorder.orders_counter=0;
            t2.deployed=date;
            //Remove and Deployed date chnage

            let success_order=borrow_global_mut<TotalSuccessOrder>(addr);
            let length=vector::length(&success_order.orders);
            let i=0;
            let buyorder=borrow_global_mut<BuyOrder>(addr); 
            let sellorder=borrow_global_mut<SellOrder>(addr); 
            let marketPrice=borrow_global_mut<MarketPrice>(addr); 
            while(i < length){
               
                let order=*vector::borrow_mut(&mut success_order.orders,i);
                let n_day=order.n_days;
                if(n_day > 1){
                    order.n_days=n_day-1;
                    order.price=marketPrice.data;
                    
                    if(order.side){
                        order.liquidation_price=marketPrice.data + (marketPrice.data*90/(order.leverage*100));
                        vector::push_back(&mut sellorder.orders,order);
                        if(!simple_map::contains_key(&sellmap.maps, &order.price)){
                            let vet=vector::empty<Order>();
                            simple_map::add(&mut sellmap.maps,order.price, vet);
                        };
                        let vec=*simple_map::borrow_mut(&mut sellmap.maps, &order.price);
                        vector::push_back(&mut vec,order);
                        simple_map::upsert(&mut sellmap.maps,order.price ,vec);
                        sellorder.orders_counter=sellorder.orders_counter+1;
                    }
                    else{
                        order.liquidation_price=marketPrice.data - (marketPrice.data*90/(order.amount*order.leverage*100));
                        vector::push_back(&mut buyorder.orders,order);
                        if(!simple_map::contains_key(&buymap.maps, &order.price)){
                            let vet=vector::empty<Order>();
                            simple_map::add(&mut buymap.maps,order.price, vet);
                        };
                        let vec=*simple_map::borrow_mut(&mut buymap.maps, &order.price);
                        vector::push_back(&mut vec,order);
                        simple_map::upsert(&mut buymap.maps,order.price ,vec);
                        buyorder.orders_counter=buyorder.orders_counter+1;
                    }
            }
            else{

                //***************************/
                // transferFromResource(order.trader,order.leverage*order.amount*marketPrice.data);
            };
            i=i+1;
        };
        vector::trim(&mut success_order.orders,0);  
        };   

    }

    //Inserts In Heap
    public fun insert(val: u64) acquires Heap {
        let owner=getOwner();
        let heap = borrow_global_mut<Heap>(owner);
        vector::push_back(&mut heap.data, val);
        let length = vector::length(&heap.data);
        if(length != 1 ){
            let i = length - 1;
            let parent =*vector::borrow_mut(&mut heap.data, i);
            let idx = (i-1)/2;
            let child =*vector::borrow_mut(&mut heap.data, idx);
            while (i  != 0 && parent > child ) {
                let idx1 = (i-1)/2;
                vector::swap(&mut heap.data, i, idx1);
                if(i != 2 && i != 1 && i != 0){
                    i = (i - 1) / 2;
                    parent = *vector::borrow_mut(&mut heap.data, i);
                    let idx2 = (i-1)/2;
                    child =*vector::borrow_mut(&mut heap.data, idx2);
                }else{
                    break
                }
            }
    }
    }

    //BuyHeap Updation
    public fun buyinsert(val: Pair) acquires BuyHeap {
        let owner=getOwner();
        let heap = borrow_global_mut<BuyHeap>(owner);
        vector::push_back(&mut heap.data, val);
        let length = vector::length(&heap.data);
        if(length != 1 ){
            let i = length - 1;
            let parent =*vector::borrow_mut(&mut heap.data, i);
            let idx = (i-1)/2;
            let child =*vector::borrow_mut(&mut heap.data, idx);
            while (i  != 0 && parent.price > child.price ) {
                let idx1 = (i-1)/2;
                vector::swap(&mut heap.data, i, idx1);
                if(i != 2 && i != 1 && i != 0){
                    i = (i - 1) / 2;
                    parent = *vector::borrow_mut(&mut heap.data, i);
                    let idx2 = (i-1)/2;
                    child =*vector::borrow_mut(&mut heap.data, idx2);
                }
                else{
                    break
                }
            }
    }
    }

    //SellHeap Updation
    public fun sellinsert(val: Pair) acquires SellHeap {
        let owner=getOwner();
        let heap = borrow_global_mut<SellHeap>(owner);
        vector::push_back(&mut heap.data, val);
        let length = vector::length(&heap.data);
        if(length != 1 ){
            let i = length - 1;
            let parent =*vector::borrow_mut(&mut heap.data, i);
            let idx = (i-1)/2;
            let child =*vector::borrow_mut(&mut heap.data, idx);
            while (i  != 0 && parent.price < child.price ) {
                let idx1 = (i-1)/2;
                vector::swap(&mut heap.data, i, idx1);
                if(i != 2 && i != 1 && i != 0){
                    i = (i - 1) / 2;
                    parent = *vector::borrow_mut(&mut heap.data, i);
                    let idx2 = (i-1)/2;
                    child =*vector::borrow_mut(&mut heap.data, idx2);
                }
                else{
                    break
                }
            }
    }
    }

    //Heap Algorithm
    public fun heapify(_ii: u64) acquires Heap {
    let i = 0;
    let owner=getOwner();
    let heap = borrow_global_mut<Heap>(owner);
    let length = vector::length(&heap.data);
    let n = length - 1;
    let n2 = n/2;
    while (i <= n2) { 
        let min = i;
        let leftidx = 2 * i + 1;
        let rightidx = 2 * i + 2;
        
        let leftexist = 0;
        if(leftidx < n){
            leftexist = 1;
        };
        let rightexist = 0;
        if(rightidx < n){
        
            rightexist = 1;
        };
    
        let parent =*vector::borrow_mut(&mut heap.data, min);
        if(leftexist == 1){
            let left =*vector::borrow_mut(&mut heap.data, leftidx);
            if ((leftidx <= n) && (parent > left) ) {
                min = 2 * i + 1;
            };
        };
        
        parent =*vector::borrow_mut(&mut heap.data, min);
        if(rightexist == 1){
            let right =*vector::borrow_mut(&mut heap.data, rightidx);
            if ((rightidx <= n) && (right < parent)) {
                min = 2 * i + 2;
            };
        };
        
        if (min != i) {
            let _swap1 =*vector::borrow_mut(&mut heap.data, i);
            vector::swap(&mut heap.data, i, min);
            let _swap2 =*vector::borrow_mut(&mut heap.data, i);
            
            i = min;
        } else {
            break
        };
    }
    }

    public fun buyheapify(_ii: u64,heap:&mut BuyHeap){
    let i = 0;
    let length = vector::length(&heap.data);
    let n = length - 1;
    let n2 = n/2;
    while (i <= n2) { 
        let min = i;
        let leftidx = 2 * i + 1;
        let rightidx = 2 * i + 2;
        
        let leftexist = 0;
        if(leftidx < n){
            leftexist = 1;
        };
        let rightexist = 0;
        if(rightidx < n){
        
            rightexist = 1;
        };
        
        let parent =*vector::borrow_mut(&mut heap.data, min);
        if(leftexist == 1){
            let left =*vector::borrow_mut(&mut heap.data, leftidx);
            if ((leftidx <= n) && (parent.price < left.price) ) {
                min = 2 * i + 1;
            };
        };
        
        parent =*vector::borrow_mut(&mut heap.data, min);
        if(rightexist == 1){
            let right =*vector::borrow_mut(&mut heap.data, rightidx);
            if ((rightidx <= n) && (right.price > parent.price)) {
                min = 2 * i + 2;
            };
        };
        
        if (min != i) {
        let _swap1 =*vector::borrow_mut(&mut heap.data, i);
        vector::swap(&mut heap.data, i, min);
        let _swap2 =*vector::borrow_mut(&mut heap.data, i);
        i = min;
        } else {
            break
        };
    }
    }


    public fun sellheapify(_ii: u64,heap:&mut SellHeap) {
        let i = 0;
        
        let length = vector::length(&heap.data);
        let n = length - 1;
        let n2 = n/2;
        while (i <= n2) { 
            let min = i;
            let leftidx = 2 * i + 1;
            let rightidx = 2 * i + 2;
            
            let leftexist = 0;
            if(leftidx < n){
                leftexist = 1;
            };
            let rightexist = 0;
            if(rightidx < n){
                rightexist = 1;
            };
            
            let parent =*vector::borrow_mut(&mut heap.data, min);
            if(leftexist == 1){
                let left =*vector::borrow_mut(&mut heap.data, leftidx);
                if ((leftidx <= n) && (parent.price > left.price) ) {
                    min = 2 * i + 1;
                };
            };
            
            parent =*vector::borrow_mut(&mut heap.data, min);
            if(rightexist == 1){
                let right =*vector::borrow_mut(&mut heap.data, rightidx);
                if ((rightidx <= n) && (right.price < parent.price)) {
                    min = 2 * i + 2;
                };
            };
            
            if (min != i) {
            let _swap1 =*vector::borrow_mut(&mut heap.data, i);
            vector::swap(&mut heap.data, i, min);
            let _swap2 =*vector::borrow_mut(&mut heap.data, i);
            i = min;
            } else {
                break
            };
        }
    }

    

//Transfer From Resource Account
    public fun transferFromResource(addr:address,amount:u64) acquires ModuleData{
        let module_data = borrow_global_mut<ModuleData>(@resource_account);
        let resource_signer = account::create_signer_with_capability(&module_data.resource_signer_cap);
        aptos_account::transfer(&resource_signer,addr, amount);
    }

    // GLobal Function to Transferring Amount
    public fun transferAmount(account:&signer,to :address ,transferAmount:u64){
        let addr=signer::address_of(account);
        let from_acc_balance:u64 = coin::balance<AptosCoin>(addr);
        assert!(from_acc_balance >= transferAmount,E_NOT_ENOUGH_COINS);
        aptos_account::transfer(account,to,transferAmount); 

    }   
    //Traders Profit To get Back Money stored in Resource account
    public entry fun getMoneyBack(acc:&signer,amount:u64) acquires ModuleData{
        let add=signer::address_of(acc);
        transferFromResource(add,amount);

    }

    //Fetches the Top Element of the Heap
#[view]
public fun min() : u64 acquires Heap  {
    let owner =getOwner();
    let heap = borrow_global_mut<Heap>(owner);
    let length = vector::length(&heap.data);
    assert!(length > 0, E_HEAP_EMPTY);
    let min = *vector::borrow_mut(&mut heap.data, 0);
    return min
}

public fun buyhigh(heap:&mut BuyHeap) : Pair {
    let length = vector::length(&heap.data);
    assert!(length > 0, E_HEAP_EMPTY);
    let high = *vector::borrow_mut(&mut heap.data, 0);
    return high
}

public fun sellmin(heap :&mut SellHeap) : Pair {
    let length = vector::length(&heap.data);
    assert!(length > 0, E_HEAP_EMPTY);
    let min = *vector::borrow_mut(&mut heap.data, 0);
    return min
}

//Pops the Top Element of the heap

    public fun extract_min() acquires Heap{
        let owner=getOwner();
    let heap = borrow_global_mut<Heap>(owner);
    let _min =*vector::borrow_mut(&mut heap.data, 0);
    let length = vector::length(&heap.data);
    if(length != 1 && length != 0){
        vector::swap(&mut heap.data, 0, length - 1);
        vector::pop_back(&mut heap.data);
        heapify(0);
    }
    }

    public fun sellextract_min(heap:&mut SellHeap) {

    let _min =*vector::borrow_mut(&mut heap.data, 0);
    let length = vector::length(&heap.data);
    if(length != 1 && length != 0){
        vector::swap(&mut heap.data, 0, length - 1);
        vector::pop_back(&mut heap.data);  
        sellheapify(0,heap);
    }
    }

    public fun buyextract_max(heap:&mut BuyHeap) {

    let _min =*vector::borrow_mut(&mut heap.data, 0);
    let length = vector::length(&heap.data);
    if(length != 1 && length != 0){
        vector::swap(&mut heap.data, 0, length - 1);
        vector::pop_back(&mut heap.data);  
        buyheapify(0,heap);
    }
    }

   // View Function For Debugging
    #[view]
    public fun getSellHeap():vector<Pair> acquires SellHeap {
        let owner=getOwner();
        let buy_map=borrow_global_mut<SellHeap>(owner);
        return buy_map.data
    }
    #[view]
    public fun getBuyHeap(): vector<Pair> acquires BuyHeap {
        let owner=getOwner();
        let buy_map=borrow_global_mut<BuyHeap>(owner);
        return buy_map.data
    }

    #[view]
    public fun getSellMap():SimpleMap<u64,vector<Order>> acquires SellMap {
        let owner=getOwner();
        let buy_map=borrow_global_mut<SellMap>(owner);
        return buy_map.maps
    }


    #[view]
    public fun getBuyMap():SimpleMap<u64,vector<Order>> acquires BuyMap {
        let owner=getOwner();
        let buy_map=borrow_global_mut<BuyMap>(owner);
        return buy_map.maps
    }

    //Function To Place Order At Limit Price
    public entry fun place_Order(account :&signer ,amount :u64 , price : u64 ,timestamp: u64,date:u64, side : bool,leverage: u64) acquires MarketPriceList,SellHeap, BuyHeap, Heap,LastSuccess, BuyOrder ,SellOrder,BuyMap,SellMap, Timestamp,TotalSuccessOrder,MarketPrice{
        let expiry_stamp = 86400;
        let owner =getOwner();
        let addr=signer::address_of(account);
        
        //Expiry Check
        expiryOrderBookNotMatch(date);

        if(side){

            let sellorder=borrow_global_mut<SellOrder>(owner);    
            let sell_counter = sellorder.orders_counter + 1;
            let order = Order {
                index : sell_counter-1,
                trader: addr,
                amount: amount,
                price: price,
                timestamp: timestamp,
                expiry_stamp: timestamp + expiry_stamp,
                side: side,
                matched: false,
                leverage: leverage,
                liquidation_price: (price + (price*90/(leverage*100))) ,
                n_days:1,


            };
            let pair = Pair {
                price: price,
                quantity: amount,
            };
            vector::push_back(&mut sellorder.orders, order);
            sellorder.orders_counter = sell_counter;

            //Adding In Map
            let sell_map=borrow_global_mut<SellMap>(owner);
            if(!simple_map::contains_key(&sell_map.maps, &price)){
                let vet=vector::empty<Order>();
                simple_map::add(&mut sell_map.maps,price, vet);
            };
            sellinsert(pair);
            let vec=*simple_map::borrow_mut(&mut sell_map.maps, &price);
            vector::push_back(&mut vec,order);
            simple_map::upsert(&mut sell_map.maps,price ,vec); 
        }
        else{
            let buyorder=borrow_global_mut<BuyOrder>(owner);    
            let buy_counter = buyorder.orders_counter + 1;
            let order = Order {
                index : buy_counter-1,
                trader: addr,
                amount: amount,
                price: price,
                timestamp: timestamp,
                expiry_stamp: timestamp + expiry_stamp,
                side: side,
                matched:false,
                leverage: leverage,
                liquidation_price: (price - (price*90/(leverage*100))) ,
                n_days:1,

            };
            let pair = Pair {
                price: price,
                quantity: amount,
            };
            vector::push_back(&mut buyorder.orders, order);
            buyorder.orders_counter = buy_counter;
            //Adding in BuyMap 
            let buy_map=borrow_global_mut<BuyMap>(owner);
             if(!simple_map::contains_key(&buy_map.maps, &price)){
                let vet=vector::empty<Order>();
                simple_map::add(&mut buy_map.maps,price, vet);
            };

            insert(price); 
            buyinsert(pair);
            let vec=*simple_map::borrow_mut(&mut buy_map.maps, &price);
            vector::push_back(&mut vec,order);
            simple_map::upsert(&mut buy_map.maps,price ,vec); 
        };
        // realMarketPrice(amount, !side);
        liquidationLoop();
        // transferAmount(account,owner, amount*price);
        //-----------------------------------------------------------------------------
        matchOrder();
        

    }   

    //Function To Place Orders at Market Price   
    public entry fun market_place_Order(account: &signer, amount: u64, timestamp : u64, date: u64, side : bool, leverage: u64)acquires Heap, Timestamp,MarketPrice,BuyOrder,SellOrder,LastSuccess, MarketPriceList, SellHeap, BuyHeap,SellMap, BuyMap, TotalSuccessOrder{
        let owner = getOwner();
        expiryOrderBookNotMatch(date);
        let expiry_stamp = 86400;
        let addr = signer::address_of(account);
        let buyList=borrow_global_mut<BuyOrder>(owner);
        let sellList=borrow_global_mut<SellOrder>(owner);
        let buyheap = borrow_global_mut<BuyHeap>(owner);
        let sellheap = borrow_global_mut<SellHeap>(owner);
        let length1 = vector::length(&buyheap.data);
        let length2 = vector::length(&sellheap.data);
        let lastSuccessPrice = borrow_global_mut<LastSuccess>(owner);
        let marketpricelist = borrow_global_mut<MarketPriceList>(owner);
        let buymap = borrow_global_mut<BuyMap>(owner);
        let sellmap = borrow_global_mut<SellMap>(owner);
        let quantity1 = amount;
       let successList = borrow_global_mut<TotalSuccessOrder>(owner);
        
        if(side && length1 > 0){
            let transferAmount = 0;
            let highestpricebuy =  *vector::borrow_mut(&mut buyheap.data, 0);
            while(quantity1 > highestpricebuy.quantity && length1 > 1 && highestpricebuy.quantity != 0 ){ 

                let buymap_record = *simple_map::borrow_mut(&mut buymap.maps, &highestpricebuy.price);
                let firstBuyOrder = *vector::borrow_mut(&mut buymap_record, 0);
                let buyIndex=firstBuyOrder.index;
                transferAmount = transferAmount + highestpricebuy.quantity * highestpricebuy.price;
                    let order = Order {
                        index : 122,
                        trader: addr,
                        amount: highestpricebuy.quantity,
                        price: highestpricebuy.price,
                        timestamp: timestamp,
                        expiry_stamp: timestamp + expiry_stamp,
                        side: side,
                        matched: true,
                        leverage: leverage,
                        liquidation_price: (highestpricebuy.price + (highestpricebuy.price*90/(leverage*100))) ,
                        n_days:1,
                    };
                    let order1=firstBuyOrder;
                    order1.amount = highestpricebuy.quantity;
                    firstBuyOrder.matched = true;
                    vector::push_back(&mut successList.orders , order);
                    vector::push_back(&mut successList.orders , order1);
                    firstBuyOrder.amount = 0;
                    vector::remove(&mut buyList.orders, buyIndex);
                    vector::insert(&mut buyList.orders, buyIndex, firstBuyOrder);
                    vector::remove(&mut buymap_record, 0);
                    vector::insert(&mut buymap_record, 0, firstBuyOrder);
                    simple_map::upsert(&mut buymap.maps,highestpricebuy.price,buymap_record);

                    lastSuccessPrice.price = highestpricebuy.price;
                    let pricetimepair = Pricetimepair {
                        price : highestpricebuy.price,
                        timestamp : timestamp,
                    };
                    vector::push_back(&mut marketpricelist.data, pricetimepair);  
                                
                    quantity1 = quantity1 - highestpricebuy.quantity;
                    highestpricebuy.quantity=0;
                    buyextract_max(buyheap);
                    highestpricebuy =  *vector::borrow_mut(&mut buyheap.data, 0);
                    length1 = length1 - 1;
            };

            if((quantity1 > 0 || length1 == 1) && highestpricebuy.quantity!= 0 ){

                    let buymap_record = *simple_map::borrow_mut(&mut buymap.maps, &highestpricebuy.price);
                    let firstBuyOrder = *vector::borrow_mut(&mut buymap_record, 0);
                            let buyIndex=firstBuyOrder.index;
                            transferAmount = transferAmount + quantity1 * highestpricebuy.price;
                   
                    let order = Order {
                                    index : 110,
                                    trader: addr,
                                    amount: quantity1,
                                    price: highestpricebuy.price,
                                    timestamp: timestamp,
                                    expiry_stamp: timestamp + expiry_stamp,
                                    side: side,
                                    matched: true,
                                    leverage: leverage,
                                    liquidation_price: (highestpricebuy.price + (highestpricebuy.price*90/(leverage*100))) ,
                                    n_days:1,
                                };
                                
                                if(firstBuyOrder.amount >= quantity1){
                                    firstBuyOrder.amount = firstBuyOrder.amount - quantity1;
                                };
                                if(highestpricebuy.quantity >= quantity1){
                                    highestpricebuy.quantity= highestpricebuy.quantity - quantity1;
                                };
                                let ppair = Pair {
                                    price: highestpricebuy.price,
                                    quantity: highestpricebuy.quantity,
                                };
                                
                                vector::push_back(&mut successList.orders , order);
                                vector::remove(&mut buymap_record, 0);
                                vector::insert(&mut buymap_record, 0, firstBuyOrder);
                                vector::remove(&mut buyList.orders, buyIndex);
                                vector::insert(&mut buyList.orders, buyIndex, firstBuyOrder);
                                firstBuyOrder.amount=quantity1;
 
                                
                                vector::push_back(&mut successList.orders , firstBuyOrder);
                                simple_map::upsert(&mut buymap.maps,highestpricebuy.price,buymap_record);
                                
                                lastSuccessPrice.price = highestpricebuy.price;
                                let pricetimepair = Pricetimepair {
                                    price:highestpricebuy.price,
                                    timestamp:timestamp,
                                };
                                vector::push_back(&mut marketpricelist.data, pricetimepair); 
                                buyextract_max(buyheap);
                                buyinsert(ppair);
                                length1 = length1 - 1;
            };
            // transferAmount(account,owner, transferAmount);

        }else{
            if(length2>0)
            {   
                let transferAmount = 0;
                let smallestseller = *vector::borrow_mut(&mut sellheap.data, 0);
                while(quantity1 > smallestseller.quantity && length2 > 1 && smallestseller.quantity != 0){

                        let sellmap_record = *simple_map::borrow_mut(&mut sellmap.maps, &smallestseller.price);
                        let firstSellOrder = *vector::borrow_mut(&mut sellmap_record, 0);
                        
                        transferAmount = transferAmount + smallestseller.quantity * smallestseller.price;
                        let sellIndex=firstSellOrder.index;
                        let order = Order {
                                    index : 100,
                                    trader: addr,
                                    amount: smallestseller.quantity,
                                    price: smallestseller.price,
                                    timestamp: timestamp,
                                    expiry_stamp: timestamp + expiry_stamp,
                                    side: side,
                                    matched:true,
                                    leverage: leverage,
                                    liquidation_price: (smallestseller.price - (smallestseller.price*90/(leverage*100))) ,
                                    n_days:1,
                                };
                                let order1 = firstSellOrder;
                                order1.amount = smallestseller.quantity;
                                
                                firstSellOrder.matched = true;
                                vector::push_back(&mut successList.orders , order);
                                vector::push_back(&mut successList.orders , order1);
                                firstSellOrder.amount = 0;
                                vector::remove(&mut sellList.orders, sellIndex);
                                vector::insert(&mut sellList.orders, sellIndex, firstSellOrder);
                                vector::remove(&mut sellmap_record, 0);
                                vector::insert(&mut sellmap_record, 0, firstSellOrder);
                                
                                simple_map::upsert(&mut sellmap.maps,smallestseller.price,sellmap_record);
                                
                                
                                
                                
                                lastSuccessPrice.price = smallestseller.price;
                                let pricetimepair = Pricetimepair{
                                    price : smallestseller.price,
                                    timestamp : timestamp,
                                };
                                vector::push_back(&mut marketpricelist.data, pricetimepair); 
                                quantity1 = quantity1 - smallestseller.quantity;
                                smallestseller.quantity=0;
                            sellextract_min(sellheap);
                        smallestseller = *vector::borrow_mut(&mut sellheap.data, 0);
                        length2 = length2 - 1;
                };

                if((quantity1 > 0 || length2 == 1) && smallestseller.quantity!= 0){
                        let sellmap_record = *simple_map::borrow_mut(&mut sellmap.maps, &smallestseller.price);

                        let firstSellOrder = *vector::borrow_mut(&mut sellmap_record, 0);
                        let sellIndex=firstSellOrder.index;
                        transferAmount = transferAmount + smallestseller.price* quantity1;

                        let order = Order {
                                    index : 100,
                                    trader: addr,
                                    amount: quantity1,
                                    price: smallestseller.price,
                                    timestamp: timestamp,
                                    expiry_stamp: timestamp + expiry_stamp,
                                    side: side,
                                    matched:true,
                                    leverage: leverage,
                                    liquidation_price: (smallestseller.price - (smallestseller.price*90/(leverage*100))) ,
                                    n_days:1,
                                };

                                if(firstSellOrder.amount >= quantity1){
                                    firstSellOrder.amount = firstSellOrder.amount - quantity1;
                                };
                                if(smallestseller.quantity >= quantity1){
                                    smallestseller.quantity = smallestseller.quantity - quantity1;
                                };
                                let ppair = Pair {
                                    price: smallestseller.price,
                                    quantity : smallestseller.quantity,
                                };
                                
                                vector::push_back(&mut successList.orders , order);
                                vector::remove(&mut sellmap_record, 0);
                                vector::insert(&mut sellmap_record, 0, firstSellOrder);
                                vector::remove(&mut sellList.orders, sellIndex);

                                vector::insert(&mut sellList.orders, sellIndex, firstSellOrder);
                                simple_map::upsert(&mut sellmap.maps,smallestseller.price,sellmap_record);
                                firstSellOrder.amount = quantity1;
                                vector::push_back(&mut successList.orders , firstSellOrder);
                                
                                
                                
                                lastSuccessPrice.price = smallestseller.price;
                                let pricetimepair = Pricetimepair {
                                    price : smallestseller.price,
                                    timestamp : timestamp,
                                };
                                vector::push_back(&mut marketpricelist.data,pricetimepair); 
                                sellextract_min(sellheap);
                                
                                sellinsert(ppair);
                                length2 = length2 - 1;
                };
                // transferAmount(account,owner, transferAmount);//----------------------------------------------------------------------------------------
            };
        };
        // liquidationLoop();
}


   
    // Extending the Expiry of the Contracts
    public entry fun editSuccessOrders(_account :&signer,index:u64,days:u64) acquires TotalSuccessOrder{
        let owner=getOwner();
        let success_order=borrow_global_mut<TotalSuccessOrder>(owner);
        let _length=vector::length(&success_order.orders);
        let order=vector::borrow_mut(&mut success_order.orders,index);
        order.n_days=days;
    }

    // Side -> false --> buyer
    //MarketPrice

    // Transfering from Resource Account
    public fun liquidateAll() acquires BuyOrder,SellOrder,ModuleData{
        let owner=getOwner();
        let buyorder=borrow_global_mut<BuyOrder>(owner); 
        let sellorder=borrow_global_mut<SellOrder>(owner);
        let buylength=vector::length(&buyorder.orders);
        let selllength=vector::length(&sellorder.orders);
        let start=0;
        while(start < buylength){
            let buy_rec=*vector::borrow(&buyorder.orders,start);
            let transferamount=buy_rec.amount*buy_rec.price;
            transferFromResource(buy_rec.trader,transferamount);
            start=start+1;
        };
        start=0;
        while(start < selllength){
            let buy_rec=*vector::borrow(&sellorder.orders,start);
            let transferamount=buy_rec.amount*buy_rec.price;
            transferFromResource(buy_rec.trader,transferamount);
            start=start+1;
        }
    }

    //Function for Matching the Orders
    public entry fun matchOrder() acquires BuyMap, Heap, SellOrder, SellMap, BuyOrder,LastSuccess, TotalSuccessOrder,MarketPriceList{
        let owner=getOwner();
        let buyList=borrow_global_mut<BuyOrder>(owner);
        let sellList=borrow_global_mut<SellOrder>(owner);
        let buymap=borrow_global_mut<BuyMap>(owner);
        let sellmap=borrow_global_mut<SellMap>(owner);
        let heap=borrow_global_mut<Heap>(owner);
        let storage = vector::empty<u64>();
        let length = vector::length(&heap.data);
        if(length > 0){   
                while(length > 0){
                    let highestPrice = *vector::borrow_mut(&mut heap.data, 0);
                   
                    length = vector::length(&heap.data);
                    let buymap_record = *simple_map::borrow_mut(&mut buymap.maps,&highestPrice);
                   
                        if(simple_map::contains_key(&sellmap.maps, &highestPrice)) {
                                let length11 = vector::length(&buymap_record);
                                let sellmap_record = *simple_map::borrow_mut(&mut sellmap.maps, &highestPrice);
                                let lenghthSellmap= vector::length(&sellmap_record);
                                
                                
                                while(length11 > 0 && (simple_map::contains_key(&sellmap.maps, &highestPrice)) && (lenghthSellmap > 0)){

                                    
                                    let sellmap_record=*simple_map::borrow_mut(&mut sellmap.maps,&highestPrice);
                                    let firstSellOrder =*vector::borrow_mut(&mut sellmap_record,0);
                                    let firstBuyOrder = *vector::borrow_mut(&mut buymap_record,0);
                                    let lastSuccessPrice=borrow_global_mut<LastSuccess>(owner);
                                    lastSuccessPrice.price=highestPrice;
                                    let marketpricelist=borrow_global_mut<MarketPriceList>(owner);
                                    let pricetimepair = Pricetimepair {
                                        price : highestPrice,
                                        timestamp : firstBuyOrder.timestamp,
                                    };
                                    vector::push_back(&mut marketpricelist.data,pricetimepair);
                                    let successList = borrow_global_mut<TotalSuccessOrder>(owner);
                                    let _buyOrderIndex=firstBuyOrder.index;
                                    let _sellOrderIndex=firstSellOrder.index;
                                    let firstSellOrderAmount = firstSellOrder.amount;
                                    let firstBuyOrderAmount = firstBuyOrder.amount;
                            

                                    if(firstBuyOrderAmount == firstSellOrderAmount){

                                        // ** match ture in  buy and Sell list **

                                        vector::push_back(&mut successList.orders , firstSellOrder );
                                        vector::push_back(&mut successList.orders, firstBuyOrder );
                                        vector::remove(&mut sellmap_record,0);
                                        vector::remove(&mut buymap_record,0);
                                        firstSellOrder.amount=0;
                                        firstBuyOrder.amount=0;
                                        firstBuyOrder.matched=true;
                                        firstSellOrder.matched=true;
                                    }else if(firstBuyOrderAmount > firstSellOrderAmount){
                                        let updatedFirstBuy=firstBuyOrder;
                                        updatedFirstBuy.amount=firstSellOrder.amount;
                                        vector::push_back(&mut successList.orders , firstSellOrder );
                                        vector::push_back(&mut successList.orders , updatedFirstBuy);
                                        &vector::remove(&mut sellmap_record,0);
                                        
                                        firstBuyOrder.amount=firstBuyOrder.amount-firstSellOrder.amount;
                                        firstSellOrder.amount=0;
                                        firstSellOrder.matched=true;

                                        vector::remove(&mut buymap_record,0);
                                        vector::insert(&mut buymap_record,0,firstBuyOrder);
                                        
                                    }else{
                                        let updatedFirstSell=firstSellOrder;
                                        updatedFirstSell.amount=firstBuyOrder.amount;
                                        vector::push_back(&mut successList.orders , firstBuyOrder );
                                        vector::push_back(&mut successList.orders , updatedFirstSell);
                                        &vector::remove(&mut buymap_record,0);
                                        firstSellOrder.amount=firstSellOrder.amount-firstBuyOrder.amount;
                                        firstBuyOrder.amount=0;
                                        firstBuyOrder.matched=true;
                                        vector::remove(&mut sellmap_record,0);
                                        vector::insert(&mut sellmap_record,0,firstSellOrder);
                                    };

                                    vector::remove(&mut buyList.orders,_buyOrderIndex);
                                    vector::insert(&mut buyList.orders,_buyOrderIndex,firstBuyOrder);

                                    vector::remove(&mut sellList.orders,_sellOrderIndex);
                                    vector::insert(&mut sellList.orders,_sellOrderIndex,firstSellOrder);
                                    
                                    simple_map::upsert(&mut sellmap.maps,highestPrice ,sellmap_record);
                                    simple_map::upsert(&mut buymap.maps,highestPrice ,buymap_record);
                                    length11 = vector::length(&buymap_record);
                                    lenghthSellmap= vector::length(&sellmap_record);
                                };
                                
                        };
                        let length22 = vector::length(&buymap_record);
                        if(length22 != 0){
                            vector::push_back(&mut storage, highestPrice);
                        };
                        if(length == 1){
                            vector::pop_back(&mut heap.data);
                        };
                        if(length != 1 && length !=0){
                                vector::swap(&mut heap.data, 0, length-1);
                                vector::pop_back(&mut heap.data);
                                let i = 0;
                                let n = length -1 ;
                                let n2 = n/2;
                                while(i <= n2){
                                    let min = i;
                                    let leftidx = 2*i +1;
                                    let rightidx = 2*i+2;
                                    let leftexist = 0;
                                    if(leftidx < n){
                                        leftexist = 1;
                                    };
                                    let rightexist = 0;
                                    if(rightidx < n){
                
                                        rightexist = 1;
                                    };

                                    let parent =*vector::borrow_mut(&mut heap.data, min);

                                    if(leftexist == 1){
                                        let left = *vector::borrow_mut(&mut heap.data, leftidx);
                                        if((leftidx <= n) && (parent > left)){
                                            min = 2 * i + 1;
                                        };
                                    };
                                    parent =*vector::borrow_mut(&mut heap.data, min);
                                    if(rightexist == 1){
                                        let right = *vector::borrow_mut(&mut heap.data, rightidx);
                                        if((rightidx <= n) && (right < parent)){
                                            min = 2 * i + 2;
                                        };
                                    };
                                    if( min != i){
                                        let _swap1 = *vector::borrow_mut(&mut heap.data, i);
                                        vector::swap(&mut heap.data, i, min);
                                        let _swap2 = *vector::borrow_mut(&mut heap.data, i);
                                        i = min;
                                    }else{
                                        break
                                    };
                                        };
                                        
                        };

                        length = vector::length(&heap.data);


                    }; 
        };
        

        let lengthStorage = vector::length(&storage);
        let idx = 0;
        while(idx < lengthStorage){
            let pp = *vector::borrow_mut(&mut storage,0);
            insert(pp); 
            idx = idx +1;
        };
    }


    #[test(admin = @resource_account)]

   public entry fun test_flow(admin: signer) acquires  MarketPriceList,MarketPrice,BuyOrder,LastSuccess, SellOrder,TotalSuccessOrder,BuyMap,SellMap,BuyHeap,SellHeap,Heap,Timestamp{
     let owner = signer::address_of(&admin); 
    init_module(&admin);
    assert_initialized(owner);
    let own_add=account::create_account_for_test(owner);
    let trader = account::create_account_for_test(@0x3);
    let _bet2 = account::create_account_for_test(@0x4);
    let bet3 = account::create_account_for_test(@0x5);
     place_Order(&trader,100,1999,60,1,false,1);
    
     place_Order(&bet3,100,1998,60,1,false,10);
     place_Order(&own_add,100, 1997, 60, 1, false,10);
     place_Order(&bet3,100,2000,60,1,false,10);
     place_Order(&own_add,100, 1994, 60, 1, false,10);
     place_Order(&own_add,100, 1996, 60, 1, false,10);
     place_Order(&own_add,100, 1991, 60, 1,false,10);
     place_Order(&own_add,100, 2001, 60, 1, false,10);
    market_place_Order(&trader,150, 60, 1, true,10);
    matchOrder();
   }
}