package com.example.collectors_hideout_app.Main.CollectableService

data class CollectableModel(

    val id: String,
    val collectableName: String,
    val collectableDescription: String,
    val collectablePrice: Double,
    val collectionId: String,
    val collectableState: String,
    val collectableEdition: String,
    val collectableStock: Int,
    val collectableRarity: String,
    val collectableImages: Array<String>?
)