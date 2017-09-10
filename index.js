"use strict";

const app = express();
app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routes
app.use('/', require('./routes/index'));
app.use('/webhook', require('./routes/webhook'));

app.listen(app.get("port"), function() {
    console.log("Running on port", app.get("port"));
});