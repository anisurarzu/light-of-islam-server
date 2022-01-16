const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g7zap.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("lightOfIslam");
    const questionCollection = database.collection("questions");
    const userCollection = database.collection("users");
    const eventCollection = database.collection("events");
    // const orderCollection = database.collection("orders");
    // const reviewCollection = database.collection("reviews");
    // const orderCollection = database.collection("orders");

    //get products api
    // app.get("/products", async (req, res) => {
    //   const cursor = productCollection.find({});
    //   const products = await cursor.toArray();
    //   res.send(products);
    // });

    // // get single product

    // // // delete api(products)
    // app.delete("/products/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await productCollection.deleteOne(query);
    //   res.json(result);
    // });

    //get single user

    app.get("/users/scholar/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const singleScholar = await userCollection?.findOne(query);
      res.json({ ...singleScholar, bookedDates: ["24-12-2021", "26-12-2021"] });
    });

    // get admin info

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    //scholar
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isScholar = false;
      if (user?.role === "scholar") {
        isAdmin = true;
      }
      res.json({ scholar: isScholar });
    });

    // users post api
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.json(result);
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });
    // img upload

    app.put("/users/profile/image", async (req, res) => {
      const user = req.body;
      console.log(user);
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: { image: user.image } };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    //findout single user
    app.get("/users/profile/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      res.json(user);
    });

    // get scholar

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const user = await cursor.toArray();
      res.send(user);
    });

    // admin api
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // scholar api
    app.put("/users/scholar", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "scholar" } };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // send question
    app.post("/questions", async (req, res) => {
      const question = req.body;
      const result = await questionCollection.insertOne(question);
      res.json(result);
    });

    // // get individual question api

    app.get("/questions", async (req, res) => {
      const cursor = questionCollection.find({});
      const question = await cursor.toArray();
      res.send(question);
    });

    // delete question api

    app.delete("/questions/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await questionCollection.deleteOne(query);
      res.json(result);
    });

    // get single question api
    app.get("/questions/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const question = await questionCollection.findOne(query);
      res.json(question);
    });
    // update question with answer
    app.put("/questions/answer", async (req, res) => {
      const answer = req.body;
      console.log(answer);
      const filter = { _id: ObjectId(answer.id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: { answer: answer.answer, answeredBy: answer.answeredBy },
      };
      const result = await questionCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //  create an event
    // event post api

    app.post("/events", async (req, res) => {
      const event = req.body;
      const result = await eventCollection.insertOne(event);
      res.json(result);
    });

    // get event by single user
    app.get("/events", async (req, res) => {
      const cursor = eventCollection.find({});
      const event = await cursor.toArray();
      res.send(event);
    });
    // put event
    app.put("/events/booking", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const filter = { _id: ObjectId(booking?.eventId) };
      const options = { upsert: true };
      const updateDoc = {
        $push: { booking: booking },
      };
      const result = await eventCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // //post reviews
    // app.post("/reviews", async (req, res) => {
    //   const review = req.body;
    //   const result = await reviewCollection.insertOne(review);
    //   res.json(result);
    // });
    // //get reviews
    // app.get("/reviews", async (req, res) => {
    //   const cursor = reviewCollection.find({});
    //   const reviews = await cursor.toArray();
    //   res.send(reviews);
    // });
    // //post product api

    // app.post("/products", async (req, res) => {
    //   const product = req.body;
    //   const result = await productCollection.insertOne(product);
    //   res.json(result);
    // });

    // // post api(order)
    // app.post("/orders", async (req, res) => {
    //   const order = req.body;
    //   const result = await orderCollection.insertOne(order);
    //   res.json(result);
    // });
    // // // update/put order status api

    // app.put("/orders/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const updateOrder = req.body;
    //   const filter = { _id: ObjectId(id) };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: {
    //       status: updateOrder.status,
    //     },
    //   };
    //   const result = await orderCollection.updateOne(
    //     filter,
    //     updateDoc,
    //     options
    //   );
    //   res.json(result);
    // });

    // // // delete api(orders)

    // app.delete("/orders/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await orderCollection.deleteOne(query);
    //   res.json(result);
    // });
  } finally {
    //    await client.close()
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Lof server two is running");
});

app.listen(port, () => {
  console.log("server running at port ", port);
});
