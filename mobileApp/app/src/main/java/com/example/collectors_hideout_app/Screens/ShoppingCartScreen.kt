package com.example.collectors_hideout_app.Screens

import android.annotation.SuppressLint
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.TopAppBar
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.KeyboardArrowLeft
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.collectors_hideout_app.Main.ShoppingCartItem
import com.example.collectors_hideout_app.Main.shoppingCartItems
import com.example.collectors_hideout_app.R

@Composable
fun ShoppingCartScreen(navController: NavController) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        ShoppingCartContent(navController)
    }
}

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@Composable
fun ShoppingCartContent(navController: NavController) {
    Scaffold {
        TopBar(navController)
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(start = 16.dp, end = 5.dp, top = 70.dp, bottom = 16.dp)
        ) {
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
            ) {
                // Shopping Cart Items
                items(shoppingCartItems) { item ->
                    ShoppingCartItemCard(item = item)
                }
            }

            CheckoutButton()
        }
    }
}

@Composable
fun TopBar(navController: NavController) {
    TopAppBar(
        title = {
            Box(
                modifier = Modifier.fillMaxWidth(),
                contentAlignment = Alignment.Center
            )
            {
                Text(
                    text = "Cart",
                    fontSize = 21.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    style = MaterialTheme.typography.titleLarge,
                    color = Color.White,
                )
            }
        },
        navigationIcon = {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(
                    imageVector = Icons.Filled.KeyboardArrowLeft,
                    contentDescription = "Back",
                    tint = Color.White
                )
            }
        },
        actions = {
            //Icon to scan a QR Code and auto complete a new expense data
            IconButton(onClick = { }) {
                Icon(
                    painter = painterResource(id = R.drawable.suport),
                    contentDescription = "Support",
                    tint = Color.White
                )
            }
        },
        backgroundColor = MaterialTheme.colorScheme.primary,
    )
}

@Composable
fun ShoppingCartItemCard(item: ShoppingCartItem) {
    // Fun to calculate the total price of the item, by quantity selected
    fun calculateTotalPrice(): Double {
        return item.price * item.quantity
    }

    Row(
        verticalAlignment = Alignment.CenterVertically,
    )
    {

        Card(
            modifier = Modifier
                .weight(1f)
                .padding(bottom = 10.dp)
        ) {

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Item Image
                Image(
                    painter = painterResource(id = item.image),
                    contentDescription = "Item Image",
                    modifier = Modifier
                        .size(90.dp, 90.dp)
                        .fillMaxWidth()
                )
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = item.name,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            maxLines = 1,
                        )

                    }
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 10.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        //Item Price to pay by quantity selected
                        Text(
                            text = "${calculateTotalPrice()}€",
                            fontSize = 15.sp,
                            style = MaterialTheme.typography.labelSmall
                        )
                        // Quantity Selector
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = "Qt:",
                                fontSize = 15.sp,
                                style = MaterialTheme.typography.labelSmall
                            )
                            // Add quantity from Shopping Cart item
                            IconButton(
                                onClick = { },
                                modifier = Modifier.size(15.dp),
                            ) {
                                Icon(Icons.Default.Add, contentDescription = null)
                            }
                            Text(
                                text = "${item.quantity}",
                                fontSize = 15.sp,
                                style = MaterialTheme.typography.labelSmall
                            )
                            // Remove quantity from Shopping Cart item
                            IconButton(
                                onClick = { },
                                modifier = Modifier.size(15.dp),
                            ) {
                                Icon(
                                    painter = painterResource(id = R.drawable.remove),
                                    contentDescription = "Remove"
                                )
                            }
                        }
                    }
                }
            }
        }
        // Remove item from Shopping Cart
        IconButton(onClick = {  }) {
            Icon(
                modifier = Modifier.size(25.dp),
                imageVector = Icons.Default.Delete,
                contentDescription = "Remove item",
                tint = MaterialTheme.colorScheme.onTertiary
            )
        }
    }
}

@Composable
fun CheckoutButton() {
    // Fun to calculate the total order value
    fun calculateTotalOrderValue(): Double {
        return shoppingCartItems.sumOf { it.price * it.quantity }
    }

    // checkout button
    Button(
        onClick = { },
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),

        ) {
        Text(
            "Pay: €${calculateTotalOrderValue()}",
            style = MaterialTheme.typography.labelSmall,
            color = Color.White
        )
    }
}


