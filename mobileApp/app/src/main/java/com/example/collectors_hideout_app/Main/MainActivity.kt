package com.example.collectors_hideout_app.Main

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.example.collectors_hideout_app.Screens.LoginRegisterScreen
import com.example.collectors_hideout_app.Screens.ProfileScreen
import com.example.collectors_hideout_app.ui.theme.Collectors_Hideout_APPTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val darkmode by remember { mutableStateOf(true) }
            Collectors_Hideout_APPTheme(
                darkTheme = darkmode
            ) {
               Nav()
            }
        }
    }
}