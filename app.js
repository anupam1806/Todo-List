//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-anupam:Test123@cluster0.img6b.mongodb.net/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});
const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({ 
  name: 'Welcome to todolist!' 
});
const item2 = new Item({ 
  name: 'Hit + button to add new item' 
});
const item3 = new Item({ 
  name: '<--Hit this to delete an item' 
});

const defaultItems = [item1,item2,item3];


const listSchema = {
  name : String,
  item : [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  Item.find({},function (err, foundItems) {
    if (foundItems.length === 0){
      Item.insertMany(defaultItems, function(err) {
        if(err){
          console.log("Error");
        } else{
          console.log("Successfully saved default arr to DB.");
        }
      });
      res.redirect("/");
    } else {
    if (err) return console.error(err);
    const day = date.getDate();

  res.render("list", {listTitle: day, newListItems: foundItems});
    }
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({ 
    name: itemName 
  });
  item.save();
  res.redirect("/")
});

app.post("/delete",function(req,res){
  const checkedItem = req.body.checkbox;
  Item.findByIdAndDelete(checkedItem,function(err){
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/:customList",function(req,res){
  const customList = req.params.customList ;
  
  const list = new List({
    name : customList,
    item : defaultItems
  });
  list.save();
});

app.get("/about", function(req, res){
  res.render("about");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server has started on port successfully");
});
