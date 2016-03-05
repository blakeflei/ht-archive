// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

var express      = require("express")
  , read         = require("read")
  , pg           = require("pg")
  , cons         = require("consolidate")
  , routes       = require("./routes")
  , cookieParser = require("cookie-parser")
  , path         = require("path")
  , app          = express();

user_input = {
    "usr": "",
    "host": "anidata.org",
    "port": "5432",
    "db": "crawler2"
};

var i = 2;
var argv = process.argv;
var new_len = argv.length - 1;
while(i < new_len) {
    var arg = argv[i].replace("--", "");
    if(arg in user_input) {
        user_input[arg] = argv[i + 1];
    } else {
        throw Error("Could not parse user input: " + argv[i]);
    }
    i += 2;
}


var pwd = "n@t3Lk7aSf"
//read({"prompt": "Password: ", "silent": true}, function(err, pwd) {
    var usr = user_input["usr"];
    var url = "postgres://" + usr + ":" + pwd + "@" + user_input["host"] + "/" + user_input["db"] + "?ssl=true";
    pg.connect(url, function(err, client, done) {
        "use strict";

        if(err) {
            return console.error('error fetching client from pool', err);
        }

        app.engine("html", cons.swig);

        app.set("view engine", "html");

        app.use(express.static(path.join(__dirname, 'public')));

        app.set("views", __dirname + "/views");

        app.use(cookieParser());

        var daos = require("./routes/daos");
        var searchDAO = new daos.SearchDAO(client);
        routes(app, client);

        app.listen(3000);

        console.log("Express server listening on port 3000");
    });
//});
