package com.example.collectors_hideout_app.Main.CollectableService

import retrofit2.Call
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface ApiEndpoint {
    @GET("api/collectables/{id}")
    fun getCollectable(@Path("id") id: String): Call<CollectableModel>

    @GET("api/collectables")
    fun getCollectables(): Call<List<CollectableModel>>

    @POST("api/collectables")
    fun postCollectable(): Call<CollectableModel>

    @PUT("api/collectables/{id}")
    fun putCollectable(@Path("id") id: String): Call<CollectableModel>

    @DELETE("api/collectables/{id}")
    fun deleteCollectable(@Path("id") id: String): Call<CollectableModel>

    @GET("api/users/{id}")
    fun getUser(@Path("id") id: String): Call<UserModel>
}