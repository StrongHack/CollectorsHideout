package com.example.collectors_hideout_app.Main

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.collectors_hideout_app.Screens.AuctionDetailsScreen
import com.example.collectors_hideout_app.Screens.AuctionsScreen
import com.example.collectors_hideout_app.Screens.CollectableDetailsScreen
import com.example.collectors_hideout_app.Screens.CollectablesScreen
import com.example.collectors_hideout_app.Screens.LoginRegisterScreen
import com.example.collectors_hideout_app.Screens.ProfileScreen
import com.example.collectors_hideout_app.Screens.ShoppingCartScreen

/**
 * Navigation graph for the app
 *
 * @param navController The [NavController] which controls the navigation between screens.
 */
@Composable
fun Nav() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = "AuthScreen"
    ) {
        composable("AuthScreen") {
            LoginRegisterScreen(navController = navController)
        }
        composable("ShoppingCartScreen") {
            ShoppingCartScreen(navController = navController)
        }
        composable("ProfileScreen") {
            val userId = "659d256cd1150a995e8ea973"
            ProfileScreen(navController = navController, userId = userId)
        }
        composable("CollectablesScreen"){
            CollectablesScreen(navController = navController)
        }
        composable("CollectableDetailsScreen/{collectableId}") { backStackEntry ->
            val collectableId = backStackEntry.arguments?.getString("collectableId")
            CollectableDetailsScreen(navController = navController, collectableId = collectableId!!.toInt())
        }
        composable("AuctionsScreen") {
            AuctionsScreen(navController = navController)
        }
        composable("AuctionDetailsScreen/{auctionId}") { backStackEntry ->
            val auctionId = backStackEntry.arguments?.getString("auctionId")
            AuctionDetailsScreen(navController = navController, auctionId = auctionId!!.toInt())
        }
    }
}