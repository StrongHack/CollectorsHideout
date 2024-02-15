package com.example.collectors_hideout_app.Main.Data.Collectable

import com.example.collectors_hideout_app.Main.CollectableService.ApiEndpoint
import com.example.collectors_hideout_app.Main.CollectableService.CollectableModel
import retrofit2.Callback
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET


class ApiCollectableService {

    private val retrofit = Retrofit.Builder()
        .baseUrl("http://161.35.46.184:8000/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    private val apiService = retrofit.create(ApiEndpoint::class.java)

    @GET("api/collectables/{id}")
    fun getCollectable(id: String, callback: Callback<CollectableModel>) {
        val call = apiService.getCollectable(id)
        call.enqueue(callback)
    }

    @GET("api/collectables")
    fun getCollectables(callback: Callback<List<CollectableModel>>) {
        val call = apiService.getCollectables()
        call.enqueue(callback)
    }


}