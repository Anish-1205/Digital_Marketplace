const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Entrepreneur = require("./models/Entrepreneur");
const Product = require("./models/Product");
const Review = require("./models/Review");

dotenv.config();

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Missing MONGO_URI");
    }

    await mongoose.connect(process.env.MONGO_URI);

    await Promise.all([
      User.deleteMany({}),
      Entrepreneur.deleteMany({}),
      Product.deleteMany({}),
      Review.deleteMany({})
    ]);

    const passwordHash = await bcrypt.hash("Password123!", 10);

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@hunarhub.com",
      password: passwordHash,
      role: "admin"
    });

    const entrepreneurUsers = await User.insertMany([
      {
        name: "Ravi Kumar",
        email: "ravi@hunarhub.com",
        password: passwordHash,
        role: "entrepreneur"
      },
      {
        name: "Meera Patel",
        email: "meera@hunarhub.com",
        password: passwordHash,
        role: "entrepreneur"
      },
      {
        name: "Asha Verma",
        email: "asha@hunarhub.com",
        password: passwordHash,
        role: "entrepreneur"
      }
    ]);

    const entrepreneurs = await Entrepreneur.insertMany([
      {
        user: entrepreneurUsers[0]._id,
        businessName: "Ravi Leather Works",
        category: "cobbler",
        location: "Jaipur",
        description: "Handcrafted leather repairs and custom footwear.",
        experience: 8,
        basePrice: 350,
        skills: ["Shoe Repair", "Leather Polishing"],
        availability: "Available",
        isApproved: true
      },
      {
        user: entrepreneurUsers[1]._id,
        businessName: "Meera Tailoring Studio",
        category: "tailor",
        location: "Ahmedabad",
        description: "Tailor-made outfits with traditional craftsmanship.",
        experience: 12,
        basePrice: 500,
        skills: ["Bridal Wear", "Alterations"],
        availability: "Available",
        isApproved: true
      },
      {
        user: entrepreneurUsers[2]._id,
        businessName: "Asha Pottery Collective",
        category: "potter",
        location: "Pune",
        description: "Eco-friendly pottery for modern homes.",
        experience: 6,
        basePrice: 300,
        skills: ["Clay Molding", "Glazing"],
        availability: "Available",
        isApproved: true
      },
      {
        user: entrepreneurUsers[0]._id,
        businessName: "Ravi Artisan Gifts",
        category: "artisan",
        location: "Udaipur",
        description: "Handmade souvenirs crafted by local artisans.",
        experience: 5,
        basePrice: 250,
        skills: ["Wood Carving", "Gift Packaging"],
        availability: "Available",
        isApproved: true
      },
      {
        user: entrepreneurUsers[1]._id,
        businessName: "Meera Street Vendor",
        category: "vendor",
        location: "Surat",
        description: "Local snacks and curated handmade accessories.",
        experience: 10,
        basePrice: 150,
        skills: ["Snack Catering", "Handmade Accessories"],
        availability: "Available",
        isApproved: true
      }
    ]);

    const products = await Product.insertMany([
      {
        entrepreneur: entrepreneurs[0]._id,
        name: "Leather Sandals",
        category: "cobbler",
        price: 899,
        stock: 20,
        imageUrl: "https://placehold.co/600x400"
      },
      {
        entrepreneur: entrepreneurs[0]._id,
        name: "Classic Shoe Polish Kit",
        category: "cobbler",
        price: 299,
        stock: 40,
        imageUrl: "https://placehold.co/600x400"
      },
      {
        entrepreneur: entrepreneurs[1]._id,
        name: "Custom Kurta Set",
        category: "tailor",
        price: 1899,
        stock: 12,
        imageUrl: "https://placehold.co/600x400"
      },
      {
        entrepreneur: entrepreneurs[1]._id,
        name: "Hand-stitched Blouse",
        category: "tailor",
        price: 1199,
        stock: 18,
        imageUrl: "https://placehold.co/600x400"
      },
      {
        entrepreneur: entrepreneurs[2]._id,
        name: "Terracotta Planter",
        category: "potter",
        price: 499,
        stock: 25,
        imageUrl: "https://placehold.co/600x400"
      },
      {
        entrepreneur: entrepreneurs[2]._id,
        name: "Handcrafted Tea Set",
        category: "potter",
        price: 1299,
        stock: 10,
        imageUrl: "https://placehold.co/600x400"
      },
      {
        entrepreneur: entrepreneurs[3]._id,
        name: "Wooden Photo Frame",
        category: "artisan",
        price: 699,
        stock: 30,
        imageUrl: "https://placehold.co/600x400"
      },
      {
        entrepreneur: entrepreneurs[3]._id,
        name: "Carved Desk Organizer",
        category: "artisan",
        price: 849,
        stock: 15,
        imageUrl: "https://placehold.co/600x400"
      },
      {
        entrepreneur: entrepreneurs[4]._id,
        name: "Handmade Beaded Bracelets",
        category: "vendor",
        price: 199,
        stock: 60,
        imageUrl: "https://placehold.co/600x400"
      },
      {
        entrepreneur: entrepreneurs[4]._id,
        name: "Local Spice Mix Pack",
        category: "vendor",
        price: 149,
        stock: 80,
        imageUrl: "https://placehold.co/600x400"
      }
    ]);

    await Review.insertMany([
      {
        customer: adminUser._id,
        entrepreneur: entrepreneurs[0]._id,
        rating: 5,
        comment: "Excellent craftsmanship and timely delivery."
      },
      {
        customer: adminUser._id,
        entrepreneur: entrepreneurs[1]._id,
        rating: 4,
        comment: "Great tailoring with attention to detail."
      },
      {
        customer: adminUser._id,
        entrepreneur: entrepreneurs[2]._id,
        rating: 5,
        comment: "Beautiful pottery, looks perfect at home."
      },
      {
        customer: adminUser._id,
        entrepreneur: entrepreneurs[3]._id,
        rating: 4,
        comment: "Lovely artisan products."
      },
      {
        customer: adminUser._id,
        entrepreneur: entrepreneurs[4]._id,
        rating: 4,
        comment: "Friendly vendor with quality items."
      },
      {
        customer: adminUser._id,
        product: products[0]._id,
        rating: 5,
        comment: "The sandals are super comfortable."
      },
      {
        customer: adminUser._id,
        product: products[2]._id,
        rating: 4,
        comment: "Kurta fit perfectly and looks elegant."
      },
      {
        customer: adminUser._id,
        product: products[4]._id,
        rating: 5,
        comment: "Sturdy and stylish planter."
      },
      {
        customer: adminUser._id,
        product: products[6]._id,
        rating: 4,
        comment: "Great quality wooden frame."
      }
    ]);

    console.log("✅ Seed data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed data failed", error);
    process.exit(1);
  }
};

seed();
