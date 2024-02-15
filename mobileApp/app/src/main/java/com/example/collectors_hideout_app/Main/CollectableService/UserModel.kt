package com.example.collectors_hideout_app.Main.CollectableService

data class UserModel(

    val userAuctionId : Array<String>?,
    val userCollectablesId : Array<String>?,
    val userEmail: String,
    val userOrdersId : Array<String>?,
    val userPassword: String,
    val userPersonalName: String,
    val userProfilePicture: String,
    val userPublicationId : Array<String>?,
    val userUsername: String,
    val cartsProducts: Array<String>?
)
