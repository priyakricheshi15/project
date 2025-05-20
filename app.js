const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverrdie= require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to DB"); 
})
.catch((err) =>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverrdie("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req, res)=>{
    res.send("Hi, I am root");
});

 //index Route
 app.get("/listings", async (req, res) => {
    try {  
        let allListings = await Listing.find().lean();  

        allListings = allListings.map(listing => ({
            ...listing,
            price: listing.price != null ? listing.price : 0  
        }));

        res.render("listings", { allListings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Server error. Please try again later.");
    }
});




//new Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


//show Route
app.get("/listings/:id", async (req, res) => {
   let { id } = req.params;
   const listing = await Listing.findById(id);
   res.render("listings/show.ejs", { listing });
});

//create Route
app.post("/listings", async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.listing) {
      return res.status(400).render("listings/new", { 
        error: "Invalid form data format" 
      });
    }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Successfully created new listing!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(400).render("listings/new", { 
      error: err.message,
      formData: req.body.listing // To repopulate form on error
    });
  }
});

 //Edit Route
 app.get("/listings/:id/edit", async (req, res) =>{
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs",{ listing });
 });

 //Update Route
 app.put("/listings/:id",async (req, res)=>{
    let { id } = req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     res.redirect(`/listings/${id}`);
 });

 //Delete Route
 app.delete("/listings/:id", async (req, res)=> {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
 });

// app.get("/testListing", async (req, res) =>{
//     let sampleListing = new Listing({
//         title: "my new flower",
//         description: "By the gaden",
//         price:120,
//         location:"patna delhi",
//         country:"india"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});