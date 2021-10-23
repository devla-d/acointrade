
 // <script type="text/javascript">
$(document).ready(function(){
   // your on click function here
   $('a.page-link').click(function(e){
       e.preventDefault();
       $('#tradehistory').load($(this).attr('href'));
       return false;
   });
});
    // </script>


// <script type="text/javascript">

    $("input[type='number']").inputSpinner();

    //auto select
    showOptions(2);

    var t;
    var co = 0;

    var ont = false;

    //showOptions(2);

    function showOptions( cat_id )
    {
        $.getJSON('get-symbols/'+cat_id, function(d){
           var htmlop = ''; 
            for(i=0; i < d.length; i++)
            {
                window.localStorage.removeItem('pair'+d[i].id);
                
                window.localStorage.setItem('pair'+d[i].id, JSON.stringify(d[i]));
                
                htmlop += '<option value="'+d[i].id+'" onclick=setOption('+ d[i].id +')>'+d[i].pair_name+'</option>';
            }
            $('#showsymbols').html(htmlop);

            setOption($('#showsymbols').val());

        });
    }

    
    function randombetween(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    
    
    function check( obj )
    {
        console.log( obj );
        
        setOption($('#showsymbols option:eq('+obj+')').val());
    }


    function toTitleCase(slug) {
        var words = slug.split('_');

        for(var i = 0; i < words.length; i++) {
        var word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.slice(1);
        }

        return words.join(' ');
    }


    function setOption( opt )
    {
        var optparam =  JSON.parse(window.localStorage.getItem('pair'+opt));
        console.log(optparam);
        $('#amount_trade').attr('min', optparam.minimum);
        $('#amount_trade').attr('step', optparam.step);
        $('#amount_trade').val( optparam.minimum );

        var tradingGraph = new TradingView.widget(
        {
            "width": '100%',
            "height": 400,
            "symbol": "COINBASE:"+optparam.fromsym+optparam.tosym,
            "interval": "1",
            "timezone": "Etc/UTC",
            "theme": "Dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "rgba(0, 0, 0, 0)",
            "enable_publishing": false,
            "hide_legend": true,
            "allow_symbol_change": false,
            "container_id": "tradingview_6f76f"
        });
        
        const products = [
        { 
            id: ''+optparam.fromsym+'-'+optparam.tosym,
            label: ''+optparam.pair_name,
        }];


        const subscribe = {
        type: 'subscribe',
        channels: [
        {
            name: 'ticker',
            product_ids: products.map(product => product.id),
        }
        ]};


        const ws = new WebSocket('wss://ws-feed.gdax.com');
        ws.onopen = () => {
            ws.send(JSON.stringify(subscribe));
        };

        const lastUpdate = 0;
          
        var coinCurrentPrices = 0;
        var coinInitialPrices = 0;


        ws.onmessage = (e) => {
            const value = JSON.parse(e.data);
            console.log( value );
            if (value.type !== 'ticker') {
                return;
            }

            var strikerate = '';
            var saveprice = [];
            var prices = new Array(5);
            var buy = new Array(5);
            var sell = new Array(5);
            var rate = new Array(5);
            
            
                        var max = 100;
            
            
            var price = parseFloat(value.price);

            console.log(value.product_ids);
            for(i=0; i < prices.length; i++)
            {
                prices[i] = parseFloat(value.price).toFixed(2) + (Math.floor(Math.random() * 90) + 2);
            }

            prices.sort(function(a, b){return b-a});

            buy[0] = randombetween(20, max-4);
            buy[1] = randombetween(1, max-3-buy[0]);
            buy[2] = randombetween(1, max-2-buy[0]-buy[1]);
            buy[3] = randombetween(1, max-1-buy[0]-buy[1]-buy[2]);
            buy[4] = max - buy[0] - buy[1] - buy[2] - buy[3];
                
            sell[4] = randombetween(20, max-4);
            sell[3] = randombetween(1, max-3-sell[4]);
            sell[2] = randombetween(1, max-2-sell[3]-sell[4]);
            sell[1] = randombetween(1, max-1-sell[2]-sell[3]-sell[4]);
            sell[0] = max - sell[4] - sell[3] - sell[2] - sell[1];

            sell.sort(function(a, b){return b-a});

            buy.sort(function(a, b){return b-a});

    
            for(i=0; i < prices.length; i++){

                rate[i] = (i == 0) ? 'highest_buy' : rate[i];
                rate[i] = (i == 1) ? 'high_buy' : rate[i]; 
                rate[i] = (i == 2) ? 'normal' : rate[i]; 
                rate[i] = (i == 3) ? 'high_sell' : rate[i]; 
                rate[i] = (i == 4) ? 'highest_sell' : rate[i]; 
                
                strikerate += '<option value="'+prices[i]+'" data-rate="'+rate[i]+'" selected="'+ ((i == 2) ? 'selected' :'')+'" data-buy="'+buy[i]+'" data-sell="'+(sell[(prices.length-1) - i])+'" >'+toTitleCase(rate[i])+'</option>';
               
            }

            var pricehtmlid = $("input[name='price']").val(parseFloat(value.price).toFixed(4));

            $("#priceshow").html(parseFloat(value.price).toFixed(4));

            //.val(parseFloat(value.price).toFixed(4));

            if (!coinInitialPrices) {
                coinInitialPrices = price;
            }

            coinCurrentPrices = price


            var stat = coinInitialPrices ? ((coinCurrentPrices - coinInitialPrices) / coinInitialPrices) * 100: 0.00;
              console.log(coinInitialPrices);
              console.log(coinCurrentPrices);
              if(stat >= 0){
                $('#percentshow').html('<p class="text-success"><i class="fa fa-arrow-up"></i>'+stat.toFixed(4) + '%</p>');                  
              }else{
                $('#percentshow').html('<p class="text-danger"><i class="fa fa-arrow-down"></i>'+stat.toFixed(4) + '%</p>');                  
              }
            

            $('#strikerate').html(strikerate);

            var firstbuy = $('#strikerate > option:selected').data('buy');
            var firstsell = $('#strikerate > option:selected').data('sell');
            var rate = $('#strikerate > option:selected').data('rate');
            
            var $changedInput = $("#amount_trade");
            if(firstbuy != undefined){
                processPayout(firstbuy, firstsell, rate);
            }

            $changedInput.on("input", function (event) {

                if(firstbuy != undefined){
                    processPayout(firstbuy, firstsell, rate);
                }
            });

            $changedInput.on("change", function (event) {

                if(firstbuy != undefined){
                    processPayout(firstbuy, firstsell, rate);
                }
            });


        };

    }

    $(document).ready(function(){
        $('#buy').on('click', function(e){
            e.preventDefault();
            $(this).attr('disabled', 'disabled');
            $(this).html('<i class="fa fa-spin fa-spinner"></i>');

            var btnbuy = $(this);

           $("#timestriked").val(new Date().toUTCString());

            var dataPost = $('#tradelive').serialize() + '&submit=trade_up';
            
            console.log(dataPost);

            var token = $("input[name='_token']").val();
            
            //$('#tradelive')[0].reset();
            
            $('#amount_trade').val('');

            $.ajax({                
                url: 'http://localhost/green/db/cryptocoinxpress.com/user/tradelive/buy',
                data: dataPost,
                method: "POST",
                dataType: "json",
                success: function( data ){
                    console.log( data );
                    $('.balance-btc').text(data.btc_balance);
                    $('.balance-currency').text(data.balance_currency);
                    swal("Buy Order Traded", data.message, "success");
                   $('#strikerateused').removeAttr('id').attr('id', 'strikerate');
                   clearInterval(t);
                   t = setInterval("tradehistory()", 2000);
                   co = data.secs_left;
                   console.log(co);
                   btnbuy.removeAttr('disabled');
                   btnbuy.html('<i class="fa fa-arrow-up"></i>');

                },
                error: function (data) {
                    if( data.status === 422 ) {
                        var errors = $.parseJSON(data.responseText);
                        $.each(errors, function (key, value) {
                            //console.log(key+ " " +value);
                            var error_message = '';
                            if($.isPlainObject(value)) {
                                $.each(value, function (key, value) { 
                                    error_message = value;
                                });
                            }else{
                                error_message = value;
                            }
                            console.log(error_message);
                            if(key == 'Limit'){
                                
                                swal({
                                  title: "UPGRADE REQUIRED",
                                  text: error_message,
                                  icon: "warning",
                                  button: "UPGRADE NOW"
                                })
                                .then((upgrade) => {
                                      window.location.href = "http://localhost/green/db/cryptocoinxpress.com/user/plan";
                                });

                                 return;
                                 
                                // swal({ 
                                //     title: "UPGRADE REQUIRED",
                                //     text: error_message,
                                //     type: "warning",
                                //     confirmButtonText: "UPGRADE NOW",
                                //     allowOutsideClick: 1
                                    
                                //   },
                                //   function(){
                                //     window.location.href = "http://localhost/green/db/cryptocoinxpress.com/user/plan";
                                // });
                            }
                            else
                            swal(key + " Invalid!", error_message, "error");
                            btnbuy.removeAttr('disabled');
                            btnbuy.html('<i class="fa fa-arrow-up"></i>');
                        });
                    }
                },

                
            });
        });

        $('#sell').on('click', function(e){
            e.preventDefault();
            $(this).attr('disabled', 'disabled');
            $(this).html('<i class="fa fa-spin fa-spinner"></i>');

            var btnsell = $(this);

            //make another one
            $("#timestriked").val(new Date().toUTCString());

            var dataPost = $('#tradelive').serialize() + '&submit=trade_down';

            var token = $("input[name='_token']").val();
            
           // $('#tradelive')[0].reset();
           $('#amount_trade').val('');

            $.ajax({
                type: 'POST',
                url: 'http://localhost/green/db/cryptocoinxpress.com/user/tradelive/sell',
                data: dataPost,
                dataType: "json",
                success: function( data ){
                    clearInterval(t);
                    console.log( data );
                    $('.balance-btc').text(data.btc_balance);
                    $('.balance-currency').text(data.balance_currency);
                    swal("Sell Order Traded", data.message, "success");
                   $('#strikerateused').removeAttr('id').attr('id', 'strikerate');
                   clearInterval(t)
                   t = setInterval("tradehistory()", 2000);
                   co = data.secs_left;
                   btnsell.removeAttr('disabled');
                   btnsell.html('<i class="fa fa-arrow-down"></i>');

                },
                error: function (data) {
                    if( data.status === 422 ) {
                        var errors = $.parseJSON(data.responseText);
                        $.each(errors, function (key, value) {
                            // console.log(key+ " " +value);
                    
                            var error_message = '';
                            if($.isPlainObject(value)) {
                                $.each(value, function (key, value) { 
                                    error_message = value;
                                });
                            }else{
                                error_message = value;
                            }
                            console.log(error_message);
                            if(key == 'Limit'){
                                
                                //  swal("UPGRADE REQUIRED", error_message, "warning");
                                 
                                swal({
                                  title: "UPGRADE REQUIRED",
                                  text: error_message,
                                  icon: "warning",
                                  button: "UPGRADE NOW"
                                })
                                .then((upgrade) => {
                                      window.location.href = "http://localhost/green/db/cryptocoinxpress.com/user/plan";
                                });
                                
                                 
                                 return;
                                 
                                // swal({ 
                                //     title: "",
                                //     text: error_message,
                                //     type: "warning",
                                //     confirmButtonText: "UPGRADE NOW",
                                //     allowOutsideClick: 1                        
                                //   },
                                //   function(){
                                //     window.location.href = "http://localhost/green/db/cryptocoinxpress.com/user/plan";
                                // });
                            }
                            else
                            swal(key + " Invalid!", error_message, "error");
                            
                            btnsell.removeAttr('disabled');
                            btnsell.html('<i class="fa fa-arrow-down"></i>');

                        });
                    }
                },
            });
        });

        $('#strikerate').on('change', function() {
            // var buy = $(this).data('buy');
            // var sell = $(this).data('sell');
            var buy = $("option:selected", this).data('buy');
            var sell = $("option:selected", this).data('sell');
            var rate = $("option:selected", this).data('rate');
 
            //interval
            processPayout(buy, sell, rate);
            
            //var valueSelected = this.value;
           // console.log(optionSelected);

        });

    });
    

    t = setInterval("tradehistory()", 2000);


    function processPayout(buy, sell, rate)
    {

        if(buy == undefined)
        return;

        if(sell ==undefined)
        return; 

        amount = $('#amount_trade').val(); 
        amount2 = $('#amount_trade22').val(); 
       
       

        $('#buypercent').text(buy+'%');
        $('#sellpercent').text(sell+'%');

        var buyamount = ((buy/100) * amount).toFixed(2);
        var sellamount = ((sell/100) * amount2).toFixed(2);

        

        $('#buyamount').text(''+buyamount);
        $('#sellamount').text(''+sellamount);

        $('#buypercentinput').val(buyamount);
        $('#sellpercentinput').val(sellamount);
        $('#rate').val(rate);

        $('#strikerate').removeAttr('id').attr('id', 'strikerateused');

    }

    

    function tradehistory()
    {
        $('#tradehistory').load('http://localhost/green/db/cryptocoinxpress.com/user/gethistory');

        ont = true;

        if(co < 2){
            clearInterval(t);
        }
        if(co > 0){
            co = co - 2;
        }

        console.log('Down '+ co);
    }
// </script>

// <script type="text/javascript">

   

    function showOptions( cat_id )
    {
        $.getJSON('get-symbols/'+cat_id, function(d){
           var htmlop = ''; 
            for(i=0; i < d.length; i++)
            {
                window.localStorage.removeItem('pair'+d[i].id);
                
                window.localStorage.setItem('pair'+d[i].id, JSON.stringify(d[i]));
                
                htmlop += '<option value="'+d[i].id+'" onclick=setOption('+ d[i].id +')>'+d[i].pair_name+'</option>';
            }
            $('#showsymbols').html(htmlop);

            setOption($('#showsymbols').val());

        });
    }

    
    function randombetween(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    
    
    function check( obj )
    {
        console.log( obj );
        
        setOption($('#showsymbols option:eq('+obj+')').val());
    }


    function toTitleCase(slug) {
        var words = slug.split('_');

        for(var i = 0; i < words.length; i++) {
        var word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.slice(1);
        }

        return words.join(' ');
    }


    function setOption( opt )
    {
        var optparam =  JSON.parse(window.localStorage.getItem('pair'+opt));
        console.log(optparam);
        $('#amount_trade2').attr('min', optparam.minimum);
        $('#amount_trade2').attr('step', optparam.step);
        $('#amount_trade2').val( optparam.minimum );

        var tradingGraph = new TradingView.widget(
        {
            "width": '100%',
            "height": 400,
            "symbol": "COINBASE:"+optparam.fromsym+optparam.tosym,
            "interval": "1",
            "timezone": "Etc/UTC",
            "theme": "Dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "rgba(0, 0, 0, 0)",
            "enable_publishing": false,
            "hide_legend": true,
            "allow_symbol_change": false,
            "container_id": "tradingview_6f76f"
        });
        
        const products = [
        { 
            id: ''+optparam.fromsym+'-'+optparam.tosym,
            label: ''+optparam.pair_name,
        }];


        const subscribe = {
        type: 'subscribe',
        channels: [
        {
            name: 'ticker',
            product_ids: products.map(product => product.id),
        }
        ]};


        const ws = new WebSocket('wss://ws-feed.gdax.com');
        ws.onopen = () => {
            ws.send(JSON.stringify(subscribe));
        };

        const lastUpdate = 0;
          
        var coinCurrentPrices = 0;
        var coinInitialPrices = 0;


        ws.onmessage = (e) => {
            const value = JSON.parse(e.data);
            console.log( value );
            if (value.type !== 'ticker') {
                return;
            }

            var strikerate2 = '';
            var saveprice = [];
            var prices = new Array(5);
            var buy = new Array(5);
            var sell = new Array(5);
            var rate = new Array(5);
            
            
                        var max = 100;
            
            
            var price = parseFloat(value.price);

            console.log(value.product_ids);
            for(i=0; i < prices.length; i++)
            {
                prices[i] = parseFloat(value.price).toFixed(2) + (Math.floor(Math.random() * 90) + 2);
            }

            prices.sort(function(a, b){return b-a});

            buy[0] = randombetween(20, max-4);
            buy[1] = randombetween(1, max-3-buy[0]);
            buy[2] = randombetween(1, max-2-buy[0]-buy[1]);
            buy[3] = randombetween(1, max-1-buy[0]-buy[1]-buy[2]);
            buy[4] = max - buy[0] - buy[1] - buy[2] - buy[3];
                
            sell[4] = randombetween(20, max-4);
            sell[3] = randombetween(1, max-3-sell[4]);
            sell[2] = randombetween(1, max-2-sell[3]-sell[4]);
            sell[1] = randombetween(1, max-1-sell[2]-sell[3]-sell[4]);
            sell[0] = max - sell[4] - sell[3] - sell[2] - sell[1];

            sell.sort(function(a, b){return b-a});

            buy.sort(function(a, b){return b-a});

    
            for(i=0; i < prices.length; i++){

                rate[i] = (i == 0) ? 'highest_buy' : rate[i];
                rate[i] = (i == 1) ? 'high_buy' : rate[i]; 
                rate[i] = (i == 2) ? 'normal' : rate[i]; 
                rate[i] = (i == 3) ? 'high_sell' : rate[i]; 
                rate[i] = (i == 4) ? 'highest_sell' : rate[i]; 
                
                strikerate2 += '<option value="'+prices[i]+'" data-rate="'+rate[i]+'" selected="'+ ((i == 2) ? 'selected' :'')+'" data-buy="'+buy[i]+'" data-sell="'+(sell[(prices.length-1) - i])+'" >'+toTitleCase(rate[i])+'</option>';
               
            }

            var pricehtmlid = $("input[name='price']").val(parseFloat(value.price).toFixed(4));

            $("#priceshow").html(parseFloat(value.price).toFixed(4));

            //.val(parseFloat(value.price).toFixed(4));

            if (!coinInitialPrices) {
                coinInitialPrices = price;
            }

            coinCurrentPrices = price


            var stat = coinInitialPrices ? ((coinCurrentPrices - coinInitialPrices) / coinInitialPrices) * 100: 0.00;
              console.log(coinInitialPrices);
              console.log(coinCurrentPrices);
              if(stat >= 0){
                $('#percentshow').html('<p class="text-success"><i class="fa fa-arrow-up"></i>'+stat.toFixed(4) + '%</p>');                  
              }else{
                $('#percentshow').html('<p class="text-danger"><i class="fa fa-arrow-down"></i>'+stat.toFixed(4) + '%</p>');                  
              }
            

            $('#strikerate2').html(strikerate2);

            var firstbuy = $('#strikerate2 > option:selected').data('buy');
            var firstsell = $('#strikerate2 > option:selected').data('sell');
            var rate = $('#strikerate2 > option:selected').data('rate');
            
            var $changedInput = $("#amount_trade2");
            if(firstbuy != undefined){
                processPayout(firstbuy, firstsell, rate);
            }

            $changedInput.on("input", function (event) {

                if(firstbuy != undefined){
                    processPayout(firstbuy, firstsell, rate);
                }
            });

            $changedInput.on("change", function (event) {

                if(firstbuy != undefined){
                    processPayout(firstbuy, firstsell, rate);
                }
            });


        };

    }

    $(document).ready(function(){
        $('#buy').on('click', function(e){
            e.preventDefault();
            $(this).attr('disabled', 'disabled');
            $(this).html('<i class="fa fa-spin fa-spinner"></i>');

            var btnbuy = $(this);

           $("#timestriked").val(new Date().toUTCString());

            var dataPost = $('#tradelive').serialize() + '&submit=trade_up';
            
            console.log(dataPost);

            var token = $("input[name='_token']").val();
            
            //$('#tradelive')[0].reset();
            
            $('#amount_trade2').val('');

            $.ajax({                
                url: 'http://localhost/green/db/cryptocoinxpress.com/user/tradelive/buy',
                data: dataPost,
                method: "POST",
                dataType: "json",
                success: function( data ){
                    console.log( data );
                    $('.balance-btc').text(data.btc_balance);
                    $('.balance-currency').text(data.balance_currency);
                    swal("Buy Order Traded", data.message, "success");
                   $('#strikerate2used').removeAttr('id').attr('id', 'strikerate2');
                   clearInterval(t);
                   t = setInterval("tradehistory()", 2000);
                   co = data.secs_left;
                   console.log(co);
                   btnbuy.removeAttr('disabled');
                   btnbuy.html('<i class="fa fa-arrow-up"></i>');

                },
                error: function (data) {
                    if( data.status === 422 ) {
                        var errors = $.parseJSON(data.responseText);
                        $.each(errors, function (key, value) {
                            //console.log(key+ " " +value);
                            var error_message = '';
                            if($.isPlainObject(value)) {
                                $.each(value, function (key, value) { 
                                    error_message = value;
                                });
                            }else{
                                error_message = value;
                            }
                            console.log(error_message);
                            if(key == 'Limit'){
                                
                                swal({
                                  title: "UPGRADE REQUIRED",
                                  text: error_message,
                                  icon: "warning",
                                  button: "UPGRADE NOW"
                                })
                                .then((upgrade) => {
                                      window.location.href = "http://localhost/green/db/cryptocoinxpress.com/user/plan";
                                });

                                 return;
                                 
                                // swal({ 
                                //     title: "UPGRADE REQUIRED",
                                //     text: error_message,
                                //     type: "warning",
                                //     confirmButtonText: "UPGRADE NOW",
                                //     allowOutsideClick: 1
                                    
                                //   },
                                //   function(){
                                //     window.location.href = "http://localhost/green/db/cryptocoinxpress.com/user/plan";
                                // });
                            }
                            else
                            swal(key + " Invalid!", error_message, "error");
                            btnbuy.removeAttr('disabled');
                            btnbuy.html('<i class="fa fa-arrow-up"></i>');
                        });
                    }
                },

                
            });
        });

        $('#sell').on('click', function(e){
            e.preventDefault();
            $(this).attr('disabled', 'disabled');
            $(this).html('<i class="fa fa-spin fa-spinner"></i>');

            var btnsell = $(this);

            //make another one
            $("#timestriked").val(new Date().toUTCString());

            var dataPost = $('#tradelive').serialize() + '&submit=trade_down';

            var token = $("input[name='_token']").val();
            
           // $('#tradelive')[0].reset();
           $('#amount_trade2').val('');

            $.ajax({
                type: 'POST',
                url: 'http://localhost/green/db/cryptocoinxpress.com/user/tradelive/sell',
                data: dataPost,
                dataType: "json",
                success: function( data ){
                    clearInterval(t);
                    console.log( data );
                    $('.balance-btc').text(data.btc_balance);
                    $('.balance-currency').text(data.balance_currency);
                    swal("Sell Order Traded", data.message, "success");
                   $('#strikerate2used').removeAttr('id').attr('id', 'strikerate2');
                   clearInterval(t)
                   t = setInterval("tradehistory()", 2000);
                   co = data.secs_left;
                   btnsell.removeAttr('disabled');
                   btnsell.html('<i class="fa fa-arrow-down"></i>');

                },
                error: function (data) {
                    if( data.status === 422 ) {
                        var errors = $.parseJSON(data.responseText);
                        $.each(errors, function (key, value) {
                            // console.log(key+ " " +value);
                    
                            var error_message = '';
                            if($.isPlainObject(value)) {
                                $.each(value, function (key, value) { 
                                    error_message = value;
                                });
                            }else{
                                error_message = value;
                            }
                            console.log(error_message);
                            if(key == 'Limit'){
                                
                                //  swal("UPGRADE REQUIRED", error_message, "warning");
                                 
                                swal({
                                  title: "UPGRADE REQUIRED",
                                  text: error_message,
                                  icon: "warning",
                                  button: "UPGRADE NOW"
                                })
                                .then((upgrade) => {
                                      window.location.href = "http://localhost/green/db/cryptocoinxpress.com/user/plan";
                                });
                                
                                 
                                 return;
                                 
                                // swal({ 
                                //     title: "",
                                //     text: error_message,
                                //     type: "warning",
                                //     confirmButtonText: "UPGRADE NOW",
                                //     allowOutsideClick: 1                        
                                //   },
                                //   function(){
                                //     window.location.href = "http://localhost/green/db/cryptocoinxpress.com/user/plan";
                                // });
                            }
                            else
                            swal(key + " Invalid!", error_message, "error");
                            
                            btnsell.removeAttr('disabled');
                            btnsell.html('<i class="fa fa-arrow-down"></i>');

                        });
                    }
                },
            });
        });

        $('#strikerate2').on('change', function() {
            // var buy = $(this).data('buy');
            // var sell = $(this).data('sell');
            var buy = $("option:selected", this).data('buy');
            var sell = $("option:selected", this).data('sell');
            var rate = $("option:selected", this).data('rate');

            //interval
            processPayout(buy, sell, rate);
            
            //var valueSelected = this.value;
           // console.log(optionSelected);

        });

    });
    

    t = setInterval("tradehistory()", 2000);


    function processPayout(buy, sell, rate)
    {

        if(buy == undefined)
        return;

        if(sell ==undefined)
        return; 

        amount = $('#amount_trade2').val(); 
        amount2 = $('#amount_trade22').val(); 
      

        $('#buypercent').text(buy+'%');
        $('#sellpercent').text(sell+'%');

        var buyamount = ((buy* 0.8) * (amount)).toFixed(2);
        var sellamount = ((sell * 0.8) * (amount2)).toFixed(2);

        $('#buyamount').text(''+buyamount);
        $('#sellamount').text(''+sellamount);

        $('#buypercentinput').val(buyamount);
        $('#sellpercentinput').val(sellamount);
        $('#rate').val(rate);

        $('#strikerate2').removeAttr('id').attr('id', 'strikerate2used');

    }

    

    function tradehistory()
    {
        $('#tradehistory').load('http://localhost/green/db/cryptocoinxpress.com/user/gethistory');

        ont = true;

        if(co < 2){
            clearInterval(t);
        }
        if(co > 0){
            co = co - 2;
        }

        console.log('Down '+ co);
    }
// </script>