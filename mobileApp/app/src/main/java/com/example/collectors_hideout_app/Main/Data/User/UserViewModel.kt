package com.example.collectors_hideout_app.Main.Data.User

import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import com.example.collectors_hideout_app.Main.CollectableService.UserModel
import com.example.collectors_hideout_app.Main.Data.User.ApiUserService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class UserDetailViewModel : ViewModel() {
    private val apiService = ApiUserService()

    var user by mutableStateOf<UserModel?>(null)
        private set

    var error by mutableStateOf(false)
        private set

    fun fetchUserDetail(userId: String) {
        apiService.getUser(userId, object : Callback<UserModel> {
            override fun onResponse(call: Call<UserModel>, response: Response<UserModel>) {
                if (response.isSuccessful) {
                    user = response.body()
                    error = false
                } else {
                    error = true
                    Log.d("API", "Error: ${response.code()}")
                }
            }

            override fun onFailure(call: Call<UserModel>, t: Throwable) {
                error = true
                Log.d("API", "Failure: ${t.message}")
            }
        })
    }
}