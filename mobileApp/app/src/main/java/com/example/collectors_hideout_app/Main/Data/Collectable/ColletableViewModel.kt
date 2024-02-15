package com.example.collectors_hideout_app.Main.Data.Collectable

import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import com.example.collectors_hideout_app.Main.CollectableService.CollectableModel
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CollectableDetailViewModel : ViewModel() {
    private val apiService = ApiCollectableService()

    var collectable by mutableStateOf<CollectableModel?>(null)
        private set

    var error by mutableStateOf(false)
        private set

    fun fetchCollectableDetail(collectableId: String) {
        apiService.getCollectable(collectableId, object : Callback<CollectableModel> {
            override fun onResponse(call: Call<CollectableModel>, response: Response<CollectableModel>) {
                if (response.isSuccessful) {
                    collectable = response.body()
                    error = false
                } else {
                    error = true
                    Log.d("API", "Error: ${response.code()}")
                }
            }

            override fun onFailure(call: Call<CollectableModel>, t: Throwable) {
                error = true
                Log.d("API", "Failure: ${t.message}")
            }
        })
    }

    fun fetchCollectables(){
        apiService.getCollectables(object : Callback<List<CollectableModel>> {
            override fun onResponse(call: Call<List<CollectableModel>>, response: Response<List<CollectableModel>>) {
                if (response.isSuccessful) {
                    collectable = response.body()?.get(0)
                    error = false
                } else {
                    error = true
                    Log.d("API", "Error: ${response.code()}")
                }
            }

            override fun onFailure(call: Call<List<CollectableModel>>, t: Throwable) {
                error = true
                Log.d("API", "Failure: ${t.message}")
            }
        })
    }
}