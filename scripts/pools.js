// Call populatePoolsRandomly(element) with an element to append all the pools to.
// This will allow adding the pools into any div.

var _poolCache = null;
var _poolURL = "https://raw.githubusercontent.com/SinglePoolAlliance/Registration/master/registry.json";

function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Exposes the pools as a chacheable object for use anywhere
function getCachedPools(success)
{
    if (_poolCache == null)
    {
        // Promise-interface, so make sure to call success separately in else logic
        $.getJSON(_poolURL, function(data) {
            _poolCache = data;
            if (_poolCache == null)
            {
                // Something went wrong
                console.log("_poolCache is null, are you able to reach \'" + _poolURL + "\'?");
            }

            success(_poolCache);
        });
    } else {
        success(_poolCache);
    }
}

// Returns a link with a stylized ticker box colored depending on saturation
function poolTicker(poolExtData)
{
    // Honestly, this should come from a .css
    var font = "sans-serif";
    var border = "border-radius: 8px; border-style: hidden;"
    var width = "70px";
    var height = "70px";
    var margin = "5px";

    if (poolExtData.data.saturated >= 0 && poolExtData.data.saturated <= 0.6)      
    {
        return "<a style='color:  inherit;' target='_blank' href='https://adapools.org/pool/" + poolExtData.data.pool_id + "'>" +
            `<table style='margin: ${margin}; height: ${height}; width: ${width}; ${border} font-family: ${font}; background: rgba(1, 152, 117, 1)'>` +
                "<tr><th>" + poolExtData.data.db_ticker + "</tr></th>" +
                "<tr><td>" + (poolExtData.data.saturated * 100).toFixed(2) + "%</tr></td>" +
            "</table></a>";
    }
    if (poolExtData.data.saturated > 0.6 && poolExtData.data.saturated <= 0.8)      
    {
        return "<a style='color:  inherit;' target='_blank' href='https://adapools.org/pool/" + poolExtData.data.pool_id + "'>" +
                `<table style='margin: ${margin}; height: ${height}; width: ${width}; ${border} font-family: ${font}; background: rgba(225, 165, 255, 1)'>` +
                "<tr><th>" + poolExtData.data.db_ticker + "</tr></th>" +
                "<tr><td>" + (poolExtData.data.saturated * 100).toFixed(2) + "%</tr></td>" +
            "</table></a>";
    } 
    if (poolExtData.data.saturated > 0.8 && poolExtData.data.saturated <= 0.95)      
    {
        return "<a style='color:  inherit;' target='_blank' href='https://adapools.org/pool/" + poolExtData.data.pool_id + "'>" +
                `<table style='margin: ${margin}; height: ${height}; width: ${width}; ${border} font-family: ${font}; background: rgba(225, 165, 0, 1)'>` +
                "<tr><th>" + poolExtData.data.db_ticker + "</tr></th>" + 
                "<tr><td>" + (poolExtData.data.saturated * 100).toFixed(2) + "%</tr></td>" +
            "</table></a>";
    }
    if (poolExtData.data.saturated > 0.95 && poolExtData.data.saturated <= 100)      
    {
        return "<a style='color:  inherit;' target='_blank' href='https://adapools.org/pool/" + poolExtData.data.pool_id + "'>" + 
                `<table style='margin: ${margin}; height: ${height}; width: ${width}; ${border} font-family: ${font}; background: rgba(255, 0, 0, 1)'>` +
                "<tr><th>" + poolExtData.data.db_ticker + "</tr></th>" +
                "<tr><td>" + (poolExtData.data.saturated * 100).toFixed(2) + "%</tr></td>" +
            "</table></a>";
    }

    return "<div> Missing data </div>";
}

function randPoolTicker(element)
{
    getCachedPools(function(pools) {
        // Select random pool
        randPool = pools[Math.floor(Math.random()*pools.length)];

        $.getJSON('https://js.adapools.org/pools/' + randPool.poolId + '/summary.json', function(poolExtData) {
            element.html(poolTicker(poolExtData));
        });
    });
}

function populatePoolTickersRandomly(element)
{
    getCachedPools(function(pools) {
        // Shuffle pools randomly
        shuffledPools = shuffleArray(pools);

        $.each(shuffledPools, function(key, pool) {
            $.getJSON('https://js.adapools.org/pools/' + pool.poolId + '/summary.json', function(poolExtData) {
                element.append(poolTicker(poolExtData));
            });   
        });
    });
}