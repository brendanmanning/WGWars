function randomplayers(count) {
    var players = [];

    var names = ['Steve', 'Bob', 'Bill', 'Joe', 'Jim', 'Jeff', 'Jery', 'Joey', 'Jack', 'Jill', 'Jane', 'Jolene', 'Winston', 'Barack', 'Donald', 'Ivanka', 'Frederic', 'Ronald', 'Hans', 'Enrique', 'Brendan', 'Alex', 'Alexander', 'Ben', 'Benjamin', 'Pat', 'Patrick', 'Homer', 'Ralph', 'Simon', 'Walter', 'George', 'Karen', 'Hailey', 'Catie', 'Anne', 'Tim', 'Megan'];
    var lastnames = ['Hasser', 'Kasey', 'Manning', 'Ciliberto', 'McGoey', 'Black', 'White', 'Cieslack', 'Johnson', 'Halverson', 'Trump', 'Clinton', 'Obama', 'Reagan', 'Paul', 'Atlee', 'McGinnis', 'McGregory', 'McCormick', 'DiMaggio', 'Truman', 'Day', 'Sun', 'Ganguli', 'Cross', 'Hiassen'];

    for(var i = 1; i <= count; i++) {

        var fname = names[Math.floor(Math.random() * names.length)];
        var lname = lastnames[Math.floor(Math.random() * lastnames.length)];

        var lat = Math.floor(Math.random() * 45) + 38;
        var lon = Math.floor(Math.random() * 76) + 74;  

        players.push({
            name: fname + " " + lname,
            coordinates: [lat,lon]
        });
    }

    return players;
}

function mapPlayers(players) {
    var url = "http://brendanmanning.com/for~development/plotpoints.php";
    
        var names = "&labels=";
        var lons = "&longitudes=";
        var lats = "&latitudes=";
    
        for(var i = 0; i < players.length; i++) {
            names += players[i].name
            lons += players[i].coordinates[1]
            lats += players[i].coordinates[0];
    
            if(i != players.length - 1) {
                names += ","
                lons += ","
                lats += ","
            }
        }
    
        url += "?center=45,-75" + names + lons + lats;
    
        return url;
}

module.exports = { randomplayers, mapPlayers };