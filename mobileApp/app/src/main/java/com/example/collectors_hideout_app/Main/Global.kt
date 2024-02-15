package com.example.collectors_hideout_app.Main

import android.annotation.SuppressLint
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.BottomNavigation
import androidx.compose.material.BottomNavigationItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.collectors_hideout_app.R
import java.text.SimpleDateFormat
import java.util.Date


/**
 * Data class representing an auction item
 */
data class AuctionItem(
    val id: Int,
    val name: String,
    val description: String,
    val minimumBid : Double,
    val highestBid : Double,
    val StartDate : String,
    val EndDate : String,
    val image: Int,
)

// Function to calculate the time left for an auction to end


@SuppressLint("SimpleDateFormat")
fun auctionTimeLeft(endDateString: String): String {
    val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
    return try {
        val endDate = dateFormat.parse(endDateString)
        val currentDate = Date()
        val timeLeft = endDate.time - currentDate.time
        if (timeLeft > 0) {
            val seconds = timeLeft / 1000
            val minutes = seconds / 60
            val hours = minutes / 60
            val days = hours / 24
            "${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s"
        } else {
            "Auction ended"
        }
    } catch (e: Exception) {
        "Invalid date format"
    }
}

// List of auction items
var auctionItems = listOf<AuctionItem>(
       AuctionItem(1, "Cartas Pokemon", "Cartas Pokemon de 1ª edição", 10.00, 15.00, "2024-01-01 15:30:00", "2024-01-30 15:30:00", R.drawable.pokemoncards),
        AuctionItem(2, "Seat Ibiza DieCast", "Seat Ibiza DieCast 1:18", 10.00, 15.00, "2024-01-01 15:30:00", "2024-02-25 15:30:00", R.drawable.diecastcar),
        AuctionItem(3, "Nerd Figure", "Nerd Figure", 10.00, 15.00, "2024-01-01 15:30:00", "2024-01-25 15:30:00", R.drawable.geekman),
)

/**
 * Data class representing a collection item
 */
data class CollectionItem(
    val id: Int,
    val name: String,
)

// List of collection items
var collections = listOf<CollectionItem>(
    CollectionItem(1, "Cards"),
    CollectionItem(2, "Carts"),
    CollectionItem(3, "Nerd Figure"),
)

/**
 * Data class representing a shopping cart item
 */
data class ShoppingCartItem(
    val id: Int,
    val name: String,
    val price: Double,
    val quantity: Int,
    val image: Int,
)

// List of shopping cart items
var shoppingCartItems = listOf<ShoppingCartItem>(
    ShoppingCartItem(1, "Pokemon Card", 19.99, 1, R.drawable.pokemoncards),
    ShoppingCartItem(2, "Seat Ibiza DieCast", 10.00, 3, R.drawable.diecastcar),
    ShoppingCartItem(3, "Nerd Figure", 15.59, 1, R.drawable.geekman),
)

/**
 * Data class representing a collection items
 */
val collectionsModalNavigationDrawer = listOf(
    "Other",
    "Action Figure",
    "Miniature DieCast",
    "Plush Toy",
    "Cards",
    "Building Sets"
)

/**
 * Data class representing a collection item
 */
data class CollectableItem(
    val id: Int,
    val name: String,
    val price: Double,
    val stock: Int,
    val state: String,
    val description: String,
    val edition: String,
    val rarity: String,
    val image: Int,
    val collection: String,
)

// List of collectable items
val collectablesStockList = listOf(
    CollectableItem(1, "Pokemon Card", 19.99, 3,"New", "New Pokemon Cards Set","Limited Edition","Rare",R.drawable.pokemoncards, "Cards"),
    CollectableItem(2, "Seat Ibiza DieCast", 29.99, 2,"New", "Seat Ibiza DieCast Real Cars","Real Cars Edition","Rare", R.drawable.diecastcar, "Miniature DieCast"),
    CollectableItem(3, "Nerd Figure", 14.99, 5,"New", "Blip Nerd Figure","Limited Edition","Rare", R.drawable.geekman, "Action Figure"),
    CollectableItem(4, "Plush Spider-Man", 15.99, 5,"New", "Marvel Plush","Limited Edition","Rare", R.drawable.plushspider, "Plush Toy"),
    CollectableItem(5, "Lego Harry Potter", 11.99, 5,"New", "Harry Potter Lego Set","Limited Edition","Rare", R.drawable.leggoharrypotter, "Building Sets"),
    CollectableItem(6, "Lego Playmobil", 19.99, 5,"New", "Playmobil Set","Limited Edition","Rare", R.drawable.playmobil, "Building Sets"),
    CollectableItem(7, "Hulk Figure", 29.99, 5,"New", "Hulk Marvel Figure","Limited Edition","Rare", R.drawable.hulkfigure, "Action Figure"),
    CollectableItem(8, "Pikachu Pop-Figure", 20.99, 5,"New", "New Pikachu Pop-Figure, ","Limited Edition","Rare", R.drawable.pikachupop, "Action Figure"),
    CollectableItem(9, "Yu-Gi-Oh Card Set", 12.99, 5,"New", "Yu-Gi-Oh Card Set 2001","2001 Edition","Rare", R.drawable.yugiohcard, "Cards"),
    CollectableItem(10, "Red Opel DieCast", 13.99, 5,"New", "Red Opel DieCast Real Cars","Real Cars Edition","Rare", R.drawable.opeldicast, "Miniature DieCast"),
    CollectableItem(11, "Pokemon Plush", 24.99, 5,"New", "Pokemon Plush","Limited Edition","Rare", R.drawable.pokeplush, "Plush Toy"),
    CollectableItem(12, "Giant figure Marvel", 44.99, 1,"New", "Marvel Giant Figure 1.20M","Marvel Edition","Rare", R.drawable.giantmarvel, "Other"),

    )

/**
 * Bottom bar composable
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BottomBar(navController: NavController) {
    var selectedItem by remember { mutableStateOf(0) }
    val iconSize = 25.dp // Fixed icon size
    val textSize = 15.sp // Fixed text size
    val textOffset = 4.dp // Offset to align the text

    BottomNavigation(
        backgroundColor = MaterialTheme.colorScheme.primary,
        contentColor = MaterialTheme.colorScheme.onBackground,
        modifier = Modifier
            .clip(RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
    ) {
        BottomNavigationItem(
            icon = {
                Icon(
                    painterResource(id = R.drawable.baseline_collections_24),
                    tint = MaterialTheme.colorScheme.secondary,
                    modifier = Modifier
                        .size(iconSize)
                        .offset(y = -3.dp),
                    contentDescription = "Collections"
                )
            },
            label = {
                Text(
                    "Collections",
                    modifier = Modifier.offset(y = textOffset),
                    fontSize = textSize,
                    color = Color.White,
                    style = MaterialTheme.typography.labelSmall
                )
            },
            selected = selectedItem == 0,
            onClick = { navController.navigate("CollectablesScreen") }
        )

        BottomNavigationItem(
            icon = {
                Icon(
                    painterResource(id = R.drawable.baseline_gavel_24),
                    tint = MaterialTheme.colorScheme.secondary,
                    modifier = Modifier
                        .size(iconSize)
                        .offset(y = -3.dp),
                    contentDescription = "Auctions",
                )
            },
            label = {
                Text(
                    "Auctions",
                    modifier = Modifier.offset(y = textOffset),
                    fontSize = textSize,
                    color = Color.White,
                    style = MaterialTheme.typography.labelSmall
                )
            },
            selected = selectedItem == 1,
            onClick = { navController.navigate("AuctionsScreen") }
        )

        BottomNavigationItem(
            icon = {
                Icon(
                    painterResource(id = R.drawable.baseline_person_24),
                    tint = MaterialTheme.colorScheme.secondary,
                    modifier = Modifier
                        .size(iconSize)
                        .offset(y = -3.dp),
                    contentDescription = "Profile"
                )
            },
            label = {
                Text(
                    "Profile",
                    Modifier.offset(y = textOffset),
                    fontSize = textSize,
                    color = Color.White,
                    style = MaterialTheme.typography.labelSmall
                )
            },
            selected = selectedItem == 2,
            onClick = { navController.navigate("ProfileScreen") }
        )
    }
}
