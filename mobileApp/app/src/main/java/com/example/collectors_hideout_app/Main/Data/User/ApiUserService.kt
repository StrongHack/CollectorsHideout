package com.example.collectors_hideout_app.Main.Data.User

import com.example.collectors_hideout_app.Main.CollectableService.ApiEndpoint
import com.example.collectors_hideout_app.Main.CollectableService.UserModel
import retrofit2.Callback
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET

class ApiUserService {



    private val retrofit = Retrofit.Builder()
        .baseUrl("http://161.35.46.184:8000/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    private val apiService = retrofit.create(ApiEndpoint::class.java)

    @GET("api/users/{id}")
    fun getUser(id: String, callback: Callback<UserModel>) {
        val call = apiService.getUser(id)
        call.enqueue(callback)
    }
}
