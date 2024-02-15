package com.example.collectors_hideout_app.Screens

import android.annotation.SuppressLint
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.TopAppBar
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.KeyboardArrowLeft
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.collectors_hideout_app.Main.AuctionItem
import com.example.collectors_hideout_app.Main.BottomBar
import com.example.collectors_hideout_app.Main.CollectionItem
import com.example.collectors_hideout_app.Main.ShoppingCartItem
import com.example.collectors_hideout_app.Main.auctionItems
import com.example.collectors_hideout_app.Main.auctionTimeLeft
import com.example.collectors_hideout_app.Main.collections
import com.example.collectors_hideout_app.Main.shoppingCartItems
import com.example.collectors_hideout_app.R

@Composable
fun AuctionsScreen(navController: NavController) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        AuctionsScreenContent(navController)
    }
}

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@Composable
fun AuctionsScreenContent(navController: NavController) {
    val searchQuery = remember { mutableStateOf("") }

    Scaffold(
        topBar = { TopBarAuction(navController) },
        bottomBar = { BottomBar(navController) }
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(start = 5.dp, end = 5.dp, top = 57.dp, bottom = 57.dp)
        ) {
            // Search Bar
            OutlinedTextField(
                value = searchQuery.value,
                onValueChange = { searchQuery.value = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp),
                label = { Text("Search") },
                singleLine = true,
                trailingIcon = { Icon(Icons.Filled.Search, contentDescription = "Search Icon") }
            )

            // Filter Options
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp, bottom = 15.dp),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                // Example filters - replace these with actual filter options
                items(collections) { item ->
                    FilterButton(item)
                }
            }
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
            ) {
                // Shopping Cart Items
                items(auctionItems) { item ->
                    AuctionCard(item = item, navController = navController)
                }
            }
        }
    }
}

@Composable
fun FilterButton(item: CollectionItem) {
    Button(
        onClick = { /* TODO: Add action for the button click */ },
        modifier = Modifier
            .padding(horizontal = 10.dp)
            .width(130.dp)
            .height(45.dp)
            .clip(RoundedCornerShape(50)),
        shape = RoundedCornerShape(50),
        colors = ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.primary,
            contentColor = Color.White
        )
    ) {
        Text(item.name,
            fontSize = 15.sp)
    }
}

@Composable
fun TopBarAuction(navController: NavController) {
    TopAppBar(
        title = {
            Box(
                modifier = Modifier.fillMaxWidth(),
                contentAlignment = Alignment.Center
            )
            {
                Text(
                    text = "Auctions",
                    fontSize = 21.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    style = MaterialTheme.typography.titleLarge,
                    color = Color.White,
                )
            }
        },
        navigationIcon = {
            IconButton(onClick = {
                navController.popBackStack()
            }) {
                Icon(
                    imageVector = Icons.Filled.KeyboardArrowLeft,
                    contentDescription = "Back",
                    tint = Color.White
                )
            }
        },
        actions = {
            //Icon to scan a QR Code and auto complete a new expense data
            IconButton(onClick = {
                /*TODO: Add action for the button click*/
            }) {
                Icon(
                    painter = painterResource(id = R.drawable.baseline_filter_list_alt_24),
                    contentDescription = "Filter",
                    tint = Color.White
                )
            }
        },
        backgroundColor = MaterialTheme.colorScheme.primary,
    )
}

@Composable
fun AuctionCard(item: AuctionItem, navController: NavController) {
    Row(
        modifier = Modifier
            .padding(bottom = 10.dp)
            .padding(10.dp)
            .clickable {navController.navigate("AuctionDetailsScreen/${item.id}")}
    ) {
        Column {
            // Load and display the image
            Image(
                painter = painterResource(id = item.image),
                contentDescription = item.image.toString(),
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .height(200.dp)
                    .background(MaterialTheme.colorScheme.onBackground)
            )
            Spacer(modifier = Modifier.height(12.dp))

            // Display the product name
            Text(
                text = item.name,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onBackground,
                fontWeight = FontWeight(900),
                maxLines = 1,
                fontSize = 25.sp,
                modifier = Modifier.padding(horizontal = 10.dp)
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = auctionTimeLeft(item.EndDate),
                style = MaterialTheme.typography.titleLarge,
                color = Color.Gray,
                fontWeight = FontWeight(900),
                maxLines = 1,
                fontSize = 20.sp,
                modifier = Modifier.padding(horizontal = 10.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Product Details Column
                Column(
                    modifier = Modifier
                        .padding(horizontal = 10.dp)
                        .weight(1f),
                    horizontalAlignment = Alignment.Start
                ) {
                    Text(
                        text = "${String.format("%.2f", item.highestBid)}€",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onBackground,
                        fontWeight = FontWeight(900),
                        maxLines = 1,
                        fontSize = 35.sp,
                    )
                    // Other product details...
                }

                // Bid Now Button Column
                Button(
                    onClick = { /* TODO: Add action for the button click */ },
                    modifier = Modifier
                        .padding(horizontal = 10.dp)
                        .width(150.dp)
                        .height(50.dp)
                        .clip(RoundedCornerShape(50)),
                    shape = RoundedCornerShape(50),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary,
                        contentColor = Color.White
                    )
                ) {
                    Text("Bid Now", fontSize = 15.sp)
                }
            }
        }

    }
}
