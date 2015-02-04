$(function() {

    history.pushState({page: 1});                         //all the pushStates in this program are to enable backwards navigation, mimicing a multi-page site
    
    $(window).bind("popstate", function() {
                                                          //popstate = eventlistener for back button 
        if (event.state.page == "1") {
            window.location = 'http://localhost/Matrix17/index.php?page=1';
        }

        else if (event.state.page == "2") {
            page2(thisID);
        }
        else if (event.state.page == "3") {
            page3(thisID);
        }
        else if (event.state.page == "return") {
            returnPage();

        }
        else if (event.state.page == "shipping") {
            shippingPage();

        }
        else if (event.state.page == "contact") {
            contactPage();

        }
        else if (event.state.page == "faq") {
            faqPage();

        }
        else if (event.state.page == "about") {
            aboutPage();

        }
        else if (event.state.page == "cart") {
            cartPage();

        }


    });

    checkCart();                                          //populates the cartItems array thru AJAX call to database (thru php page 'checkCart.php')

    $(".items").click(function() {
        thisID = $(this).prop("id");                      //getting the id of the selected category, then sending 
        page2(thisID);                                    //it to page 2, where it will be used in the database query  
    });


    $("#content").on('click', '.page2items', function() {
        var thisID = $(this).prop("id");                            //in the 'addToList' function the nameid of the item/object
        page3(thisID);                                              //becomes the id of the div it's displayed in
    });

    $("#content").on('click', '#cartButton', function() {
        cartItems.push(selectedItem);
        cartNumber = cartItems.length;
        $("#cartPic").html("(" + cartNumber + ")");                 //updates the number of items in the cart by the shopping-cart symbol on top of every page

        $.post("startcart.php", {cartItems: selectedItem});         //saving the item in the $_SESSION array
    });

    $("#content").on('click', '#writeReview', function() {
        $("#content").empty();
        $("#content").append("<div id='review'><div id='revName'>Reviewer's name: <input id='reviewer' placeholder=' enter your name here'></input></div>\n\
<div id='stars'>Rate the " + selectedItem.name + ": <select id='starNum'><option value='5'>5 stars</option>\n\
<option value='4'>4 stars</option><option value='3'>3 stars</option><option value='2'>2 stars</option>\n\
<option value='1'>1 star</option></select></div><div id='revHere'>Write your review of the " + selectedItem.name + " here:</div>\n\
<textarea rows='10' cols='64' id='revBox'></textarea><div id='subRevBut'>\n\
<button id='submitReview' class='btn btn-default btn-md'>submit</button></div></div>");

        $("#content").on('click', '#submitReview', function() {
            reviewer = $("#reviewer").val();
            starNum = $("#starNum").val();
            theReview = $("#revBox").val();
            itemID = selectedItem.nameid;

            $.post("review.php", {nameId: itemID, stars: starNum, reviewinsert: theReview, customername: reviewer});      //sending review info to database
            alert("Thank you!    Your review has been submitted");
            page3();
        });
    });
    $("#content").on('click', '#keepShopping', function() {
        window.location = 'http://localhost/Matrix17/index.php?page=1';
    });
});

var thisID;
var cartItems = [];
var items = [];
var reviews = [];
var cartNumber = 0;
var refinedBrandItems = [];
var refinedBrands = [];

page2 = function(thisID) {
    history.pushState({page: 2}, "title 2", "?page=2");
    $("#content").children().fadeOut(function() {
        this.remove();
    });

    addSortBox();

    if (items.length == 0) {                                //checking if the array is already populated, obviating another AJAX call
        $.getJSON("search.php", {itemType: thisID}, function(data) {
            $.each(data, function(i, h) {
                //getting all items where 'category' is same as id of item the user clicked on 

                //now we will get the average number of stars from customers' reviews of each item      

                $.getJSON("starSearch.php", {nameid: h.nameid}, function(data) {
                    $.each(data, function(a, b) {
                        $.each(b, function(c, d) {
                            if (d == null) {
                                d = 0;
                            }
                            h.stars = d;                //-giving each item object it's own 'stars' property
                            items.push(h);              //-pushing these objects to an array
                            addToList(h);               //-displaying them on the screen
                        });
                    });
                });
            });
        });
        thingsToSort = items;                           //if user refines by brand, this variable will change to equal only items from that brand, so only they will be sorted by price or best reviewed
        
        $.getJSON("brandSearch.php", {itemType: thisID}, function(data) {
            $.each(data, function(a, b) {
                refinedBrands.push(b.company);
                $('<option/>').val(b.company).html(b.company).appendTo('#brands');
            });                                          //populating the 'refine by brand' drop-down list with brands that match the selected category

        });
    }

    else {                                               //if the items array is already populated, there is no need to make another AJAX call
        $.each(items, function(a, b) {
            addToList(b);
        });

        $.each(refinedBrands, function(a, b) {
            $('<option/>').val(b).html(b).appendTo('#brands');
        });
    }


};

var page3 = function(thisID) {
    console.log(history);
    $("#content").children().fadeOut(function() {
        this.remove();
    });

    $.each(items, function(i, h) {                      //finding the item/object in the array based on it's nameid property
        if (h.nameid == thisID) {
            selectedItem = h;
        }
    });

    //now to display the item's info, with the reviews in a separate tab (using Bootstrap)

    $("<div role='tabpanel'><ul class='nav nav-tabs'><li class='active'><a href='#prod' data-toggle='tab'>product information</a></li>\n\
<li><a href='#reviews' data-toggle='tab'>reviews</a></li></ul><div class='tab-content'><div class='tab-pane fade in active' id='prod'>\n\
<div class='container' id='tabs'><br> <div class='row' ><div class='col-xs-3' id='selectedPic'><img class='bigImage' src='" + selectedItem.image + "'></div>\n\
<div class='col-xs-4' id='selectedText'><h1>" + selectedItem.name + "</h1>" + selectedItem.description + "</div><div class='col-xs-4'><div id='addToCart'>\n\
<span id='selectedPrice'>$" + selectedItem.price + "</span><br><button type='button' id='cartButton' class='btn btn-default btn-lg'>\n\
<span class='glyphicon glyphicon-shopping-cart'></span>Add to cart\n\
</button><br><br><span id='writeReview'>rate/review this product</span></div></div></div></div></div>\n\
<div class='tab-pane fade' id='reviews'><br><br></div></div>").hide().appendTo($("#content")).delay(300).fadeIn();

    thisOne = selectedItem.nameid;
    $.getJSON("getReview.php", {specificID: thisOne}, function(data) {
        $.each(data, function(i, review) {              //getting all reviews for this item and putting them in an array
            reviews.push(review);
        });
        var starTotal = 0;
        if (reviews.length == 0) {

            $("#reviews").append("<div>There are no reviews yet for this item</div>");

        }
        $.each(reviews, function(index, review) {
            $("#reviews").append("<div class='eachReview'><br>" + review.customername + "<div class='stars' id='" + review.reviewid + "'></div>&quot;" + review.reviewinsert + "&quot;<br><br></div>");

            //now to display the stars in each review 

            var darkStarNum = parseInt(review.stars);
            var liteStarNum = (5 - darkStarNum);
            starTotal += darkStarNum;

            for (x = 0; x < darkStarNum; x++) {
                $('#' + review.reviewid + '').append("<span class='glyphicon glyphicon-star'></span>");
            }
            for (x = 0; x < liteStarNum; x++) {
                $('#' + review.reviewid + '').append("<span class='glyphicon glyphicon-star-empty'></span>");
            }
        });

        //now to display the average star number next to the item 

        var avgDarkStar = Math.round(starTotal / reviews.length);
        var avgLiteStar = (5 - avgDarkStar);
        $("#selectedText h1").append("<br>");
        for (x = 0; x < avgDarkStar; x++) {

            $("#selectedText h1").append("<span class='glyphicon glyphicon-star' id='avgStar'></span>");
        }
        for (x = 0; x < avgLiteStar; x++) {

            $("#selectedText h1").append("<span class='glyphicon glyphicon-star-empty' id='avgStar'></span>");
        }
        reviews = [];

    });

    history.pushState({page: 3}, "title 3", "?page=3");
};

var addToList = function(item) {

    $("<div class='page2items' id='" + item.nameid + "'>\n\
<img class='page2img' src='" + item.image + "'/><br>" + item.name + "<br>\n\
<span id='price'>$" + item.price + "</span><br></div>").hide().appendTo($("#content")).delay(300).fadeIn(function() {

        if (item.stars > 0) {                  

            var darkStarNum = parseInt(item.stars);
            var liteStarNum = (5 - darkStarNum);

            for (x = 0; x < darkStarNum; x++) {
                $(this).append("<span class='glyphicon glyphicon-star'></span>");
            }
            for (x = 0; x < liteStarNum; x++) {
                $(this).append("<span class='glyphicon glyphicon-star-empty'></span>");
            }
        }
    });

};

var sortLow = function() {                             //sort from lower price to higher price
    $(".page2items").fadeOut();
    thingsToSort.sort(function(a, b) {
        if (parseFloat(a.price) > parseFloat(b.price)) {
            return 1;
        }
        if (parseFloat(a.price) < parseFloat(b.price)) {
            return -1;
        }
        return 0;
    });
    $.each(thingsToSort, function(i, v) {
        addToList(v);
    });
};

var sortHigh = function() {                            //sort from higher price to lower price
    $(".page2items").fadeOut();

    thingsToSort.sort(function(a, b) {
        if (parseFloat(a.price) < parseFloat(b.price)) {
            return 1;
        }
        if (parseFloat(a.price) > parseFloat(b.price)) {
            return -1;
        }
        return 0;
    });
    $.each(thingsToSort, function(i, v) {
        addToList(v);
    });
};

var sortByReview = function() {
    $(".page2items").fadeOut();

    thingsToSort.sort(function(a, b) {
        if (parseFloat(a.stars) < parseFloat(b.stars)) {
            return 1;
        }
        if (parseFloat(a.stars) > parseFloat(b.stars)) {
            return -1;
        }
        return 0;
    });
    $.each(thingsToSort, function(i, v) {
        addToList(v);
    });
};

var addSortBox = function() {
    $("<div id='sort'>sort by: <select id='sorts'><option value='sortLow'>price - low to high</option>\n\
<option value='sortHigh'>price - high to low</option><option value='bestRev'>best reviewed</option></select>\n\
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; refine by brand: <select id='brands'><option>select a brand</option></select></div>").hide()
            .appendTo($("#content")).delay(200).fadeIn();

    $("#sorts").change(function() {
        switch ($("#sorts").val()) {
            case 'sortLow':
                sortLow();
                break;
            case 'sortHigh':
                sortHigh();
                break;
            case 'bestRev':
                sortByReview();
        }
    });

    $("#brands").change(function() {
        $(".page2items").fadeOut();

        $.each(items, function(a, b) {
            if ($("#brands").val() == b.company) {
                addToList(b);
                refinedBrandItems.push(b);
            }
        });
        thingsToSort = refinedBrandItems;
    });

};

var returnPage = function() {                             //each of these pages gets different text from the same html page - NavBarText.html - using JQuery's .load method
    $("#content").empty();
    $("#content").load("NavBarText.html #returnsText");
    history.pushState({page: "return"}, "title 2", "?page=return#");
    $('.container li').removeClass('active');
    $("#return").parent().addClass('active');
};

var contactPage = function() {
    $("#content").empty();
    $("#content").load("NavBarText.html #contactText");
    history.pushState({page: "contact"}, "title 2", "?page=contact#");
    $('.container li').removeClass('active');
    $("#contact").parent().addClass('active');
};

var aboutPage = function() {
    $("#content").empty();
    $("#content").load("NavBarText.html #aboutText");
    history.pushState({page: "about"}, "title 2", "?page=about#");
    $('.container li').removeClass('active');
    $("#about").parent().addClass('active');
};

var faqPage = function() {
    $("#content").empty();
    $("#content").load("NavBarText.html #faqsText");
    history.pushState({page: "faq"}, "title 2", "?page=faq#");
    $('.container li').removeClass('active');
    $("#faqs").parent().addClass('active');
};

var shippingPage = function() {
    $("#content").empty();
    $("#content").load("NavBarText.html #shipText");
    history.pushState({page: "shipping"}, "title 2", "?page=shipping#");
    $('.container li').removeClass('active');
    $('#shipping').parent().addClass('active');
};

var cartPage = function() {
    history.pushState({page: "cart"}, "title 2", "?page=cart#");
    $("#content").empty();

    if (cartItems.length == 0) {
        $("#content").append("<div id='emptyCart'>Your cart is empty</div>");
    }

    else {
        var total = 0;
        $.each(cartItems, function(i, item) {
            $("#content").append("<div class='row' id='cartPageRow'><div class='col-xs-2'>\n\
<img src='" + item.image + "' id='theCartPic'></div><div class='col-xs-3' id='cartPageName'>\n\
" + item.name + "</div><div id='cartPagePrice' class='col-xs-offset-8'><br>" + item.price + "</div></div>");

            total += parseFloat(item.price);
        });
        total.toFixed(2);
//console.log(total);
        $("#content").append("<div id='cartTotal'>Your Total: <span id='cartTotalPrice'>$" + total +
                "</span></div><div id='checkout'><button type='button' class='btn btn-primary' id='keepShopping'>keep shopping</button>\n\
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<button type='button' class='btn btn-primary btn-lg'>Checkout</button></div>");
    }
    $('.container li').removeClass('active');
    $("#cartPage").parent().addClass('active');
};

var checkCart = function() {
    $.getJSON("checkCart.php", function(data) {

        $.each(data, function(i, v) {
            cartItems.push(v);
            cartNumber++;
        });
        if (cartNumber > 0) {
            $("#cartPic").html("(" + cartNumber + ")");
        }
    });
};


$("#return").click(function() {
    returnPage();
});

$("#contact").click(function() {
    contactPage();
});

$("#about").click(function() {
    aboutPage();
});

$("#faqs").click(function() {
    faqPage();
});

$("#shipping").click(function() {
    shippingPage();
});

$("#cartPage").click(function() {
    cartPage();
});



