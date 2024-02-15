package com.example.collectors_hideout_app.Screens

import android.annotation.SuppressLint
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Surface
import androidx.compose.material.TopAppBar
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowLeft
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.collectors_hideout_app.Main.collectablesStockList

@Composable
fun CollectableDetailsScreen(navController: NavController, collectableId: Int) {
    Surface(
        modifier = Modifier.fillMaxSize(),
    ) {
        CollectableDetailsContent(navController, collectableId)
    }
}

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@Composable
fun CollectableDetailsContent(navController: NavController, collectableId: Int) {
    Scaffold{
        TopAppBar(navController)
        CollectableDetailsCard(navController, collectableId)
    }

}

@Composable
fun TopAppBar(navController: NavController) {
    TopAppBar(
        title = {
            Box(
                modifier = Modifier.fillMaxWidth(),
                contentAlignment = Alignment.Center
            )
            {
                Text(
                    text = "Collectable",
                    fontSize = 21.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    style = MaterialTheme.typography.titleLarge,
                    color = Color.White,
                    modifier = Modifier.padding(end = 15.dp)
                )
            }
        },
        navigationIcon = {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.KeyboardArrowLeft,
                    contentDescription = "Back",
                    tint = Color.White
                )
            }
        },
        actions = {
            // Button to navigate to cart screen
            IconButton(onClick = { navController.navigate("ShoppingCartScreen") }) {
                Icon(
                    imageVector = Icons.Default.ShoppingCart,
                    contentDescription = "Cart",
                    tint = Color.White
                )
            }
        },
        backgroundColor = MaterialTheme.colorScheme.primary,
    )
}


@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@Composable
fun CollectableDetailsCard(navController: NavController, collectableId: Int) {
    // Find the collectable item by ID
    val collectableItem = collectablesStockList.find { it.id == collectableId }

    // Check if the collectable item exists
    if (collectableItem != null) {
        // Use the collectableItem to display information
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 80.dp, start = 16.dp, end = 16.dp),
            verticalArrangement = Arrangement.Center,
            //horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Display the collectable image
            Image(
                painter = painterResource(id = collectableItem.image),
                contentDescription = null,
                contentScale = ContentScale.Fit,
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
            )
            Spacer(modifier = Modifier.height(5.dp))

            // Display the product name
            Text(
                text = collectableItem.name,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                fontSize = 25.sp
            )
            Spacer(modifier = Modifier.height(5.dp))
            // Display the product price
            Text(
                text = "${collectableItem.price}€",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onBackground,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                fontSize = 20.sp
            )
            Spacer(modifier = Modifier.height(3.dp))
            // Display the product stock
            Text(
                text = "Stock: ${collectableItem.stock}",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onBackground,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                fontSize = 20.sp
            )
            Spacer(modifier = Modifier.height(3.dp))
            // Display the product state
            Text(
                text = "State: ${collectableItem.state}",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onBackground,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                fontSize = 20.sp
            )
            Spacer(modifier = Modifier.height(3.dp))
            // Display the product edition
            Text(
                text = "Edition: ${collectableItem.edition}",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onBackground,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                fontSize = 20.sp
            )
            Spacer(modifier = Modifier.height(3.dp))
            Text(
                text = "Rarity: ${collectableItem.rarity}",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onBackground,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                fontSize = 20.sp
            )
            Spacer(modifier = Modifier.height(3.dp))
            // Display the product collection
            Text(
                text = "Collection: ${collectableItem.collection}",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onBackground,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                fontSize = 20.sp
            )
            Spacer(modifier = Modifier.height(3.dp))
            // Display the product description
            Text(
                text = "Description: ${collectableItem.description}",
                style = MaterialTheme.typography.labelSmall,
                color = Color.Gray,
                maxLines = 1,
                fontSize = 15.sp
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .padding(bottom = 15.dp),
                verticalAlignment = Alignment.Bottom,
                horizontalArrangement = Arrangement.SpaceEvenly,
            ) {
                // Add to favorites button
                Button(
                    onClick = { /* TODO: Add action for the button click */ },
                    modifier = Modifier
                        .weight(0.3f)
                        .fillMaxWidth()
                        .height(50.dp)
                        .clip(RoundedCornerShape(bottomStart = 50.dp))
                        .background(MaterialTheme.colorScheme.primary),

                    colors = ButtonDefaults.buttonColors(
                        contentColor = Color.White
                    )
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Favorite,
                            contentDescription = "Adicionar aos Favoritos"
                        )
                    }
                }
                // Vertical Divider
                Spacer(
                    modifier = Modifier
                        .height(50.dp)
                        .width(2.dp)
                        .background(Color.White)
                )

                // Add to Cart Button
                Button(
                    onClick = { /* TODO: Add action for the button click */ },
                    modifier = Modifier
                        .weight(0.8f)
                        .fillMaxWidth()
                        .height(50.dp)
                        .clip(RoundedCornerShape(bottomEnd = 50.dp))
                        .background(MaterialTheme.colorScheme.primary),
                    colors = ButtonDefaults.buttonColors(
                        contentColor = Color.White
                    )
                ) {
                    Text("Add to Cart", fontSize = 17.sp)
                }
            }

        }
    } else {
        Text(text = "Collectable not found.")
    }
}
