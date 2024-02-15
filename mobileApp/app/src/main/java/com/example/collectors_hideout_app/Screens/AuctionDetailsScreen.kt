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
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.BottomNavigation
import androidx.compose.material.BottomNavigationItem
import androidx.compose.material.TopAppBar
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.KeyboardArrowLeft
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.BottomAppBar
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.collectors_hideout_app.Main.AuctionItem
import com.example.collectors_hideout_app.Main.auctionItems
import com.example.collectors_hideout_app.Main.auctionTimeLeft
import com.example.collectors_hideout_app.Main.collections
import com.example.collectors_hideout_app.R

@Composable
fun AuctionDetailsScreen(navController: NavController, auctionId: Int) {
    Surface(
        modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background
    ) {
        AuctionDetailsContent(navController, auctionId)
    }
}

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@Composable
fun AuctionDetailsContent(navController: NavController, auctionId: Int) {
    val searchQuery = remember { mutableStateOf("") }
    val biddingAmount = remember { mutableStateOf("") }
    val auctionItem = auctionItems.find { it.id == auctionId }

    Scaffold(
        bottomBar = { BottomBarAuctionDetail() },
        topBar = { TopBarAuctionDetail(navController) },
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 70.dp)
                .padding(10.dp)
        ) {
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 60.dp)
                        .padding(6.dp)
                ) {
                    if (auctionItem != null) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(15.dp),
                        ) {
                            // Auction item details
                            Image(
                                painter = painterResource(id = auctionItem.image),
                                contentDescription = null,
                                contentScale = ContentScale.Crop,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(250.dp)
                                    .clip(RoundedCornerShape(8.dp))
                            )
                            Spacer(modifier = Modifier.height(25.dp))
                            Text(
                                text = auctionItem.name,
                                style = MaterialTheme.typography.labelSmall,
                                maxLines = 1,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.ExtraBold,
                            )
                            Spacer(modifier = Modifier.height(20.dp))
                            Text(
                                text = auctionItem.description,
                                style = MaterialTheme.typography.labelSmall,
                                maxLines = 1,
                                fontSize = 15.sp,
                                color = Color.Gray,
                                fontWeight = FontWeight.Normal,
                            )
                            Spacer(modifier = Modifier.height(16.dp))

                            Text(
                                text = "Auctions Details",
                                style = MaterialTheme.typography.labelSmall,
                                maxLines = 1,
                                fontSize = 22.sp,
                                color = Color(0xFF0D85EE),
                                fontWeight = FontWeight.Bold,
                            )
                            Spacer(modifier = Modifier.height(12.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Box(modifier = Modifier.weight(1f)) {
                                    Column {
                                        Text(
                                            text = "Start Bid",
                                            style = MaterialTheme.typography.labelSmall,
                                            fontSize = 15.sp,
                                            color = Color.Gray,

                                            )
                                        Spacer(modifier = Modifier.height(5.dp))
                                        Text(
                                            text = "${auctionItem.minimumBid}",
                                            style = MaterialTheme.typography.labelSmall,
                                            fontSize = 20.sp,
                                            color = MaterialTheme.colorScheme.onBackground,
                                        )
                                    }
                                }
                                Box(modifier = Modifier.weight(1f)) {
                                    Column {
                                        Text(
                                            text = "Time Left",
                                            style = MaterialTheme.typography.labelSmall,
                                            fontSize = 15.sp,
                                            color = Color.Gray,
                                        )
                                        Spacer(modifier = Modifier.height(5.dp))
                                        Text(
                                            text = auctionTimeLeft(auctionItem.EndDate),
                                            style = MaterialTheme.typography.labelSmall,
                                            fontSize = 20.sp,
                                            color = MaterialTheme.colorScheme.onBackground,
                                        )
                                    }
                                }
                            }
                            Spacer(modifier = Modifier.height(12.dp))

                            // Row for Current Bid and Total Bids
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Box(modifier = Modifier.weight(1f)) {
                                    Column {
                                        Text(
                                            text = "Highest Bid",
                                            style = MaterialTheme.typography.labelSmall,
                                            fontSize = 15.sp,
                                            color = Color.Gray,
                                        )
                                        Spacer(modifier = Modifier.height(5.dp))
                                        Text(
                                            text = "${auctionItem.highestBid}",
                                            style = MaterialTheme.typography.labelSmall,
                                            fontSize = 20.sp,
                                            color = MaterialTheme.colorScheme.onBackground,
                                        )
                                    }
                                }
                                Box(modifier = Modifier.weight(1f)) {
                                    Column {
                                        Text(
                                            text = "Total Bids",
                                            style = MaterialTheme.typography.labelSmall,
                                            fontSize = 15.sp,
                                            color = Color.Gray,
                                        )
                                        Spacer(modifier = Modifier.height(5.dp))
                                        Text(
                                            text = "12",
                                            style = MaterialTheme.typography.labelSmall,
                                            fontSize = 20.sp,
                                            color = MaterialTheme.colorScheme.onBackground,
                                        )
                                    }
                                }
                            }
                        }
                    } else {
                        Text(text = "Collectable not found.")
                    }
                }
            }
            item {
                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = "Highest Bidder",
                    modifier = Modifier.padding(start = 10.dp),
                    style = MaterialTheme.typography.labelSmall,
                    maxLines = 1,
                    fontSize = 22.sp,
                    color = Color(0xFF0D85EE),
                    fontWeight = FontWeight.Bold,
                )
                Spacer(modifier = Modifier.height(12.dp))
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 10.dp)
                        .padding(8.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        // User photo
                        Image(
                            painter = painterResource(id = R.drawable.logo),
                            contentDescription = null,
                            modifier = Modifier
                                .size(56.dp)
                                .clip(CircleShape)
                        )

                        // User name and email
                        Column(
                            modifier = Modifier
                                .weight(1f)
                                .padding(start = 16.dp)
                        ) {
                            // Name
                            Text(
                                text = "User Name",
                                color = MaterialTheme.colorScheme.onBackground,
                                fontWeight = FontWeight.Bold,
                                style = MaterialTheme.typography.labelSmall,
                                fontSize = 18.sp,
                                modifier = Modifier.padding(bottom = 4.dp)
                            )

                            // Email
                            Text(
                                text = "user.email",
                                color = MaterialTheme.colorScheme.onBackground,
                                fontWeight = FontWeight.Normal,
                                style = MaterialTheme.typography.labelSmall,
                                fontSize = 14.sp,
                                modifier = Modifier.padding(bottom = 4.dp)
                            )
                        }

                        // Delete button
                        IconButton(
                            onClick = { /*TODO*/ }, modifier = Modifier.size(32.dp)
                        ) {
                            Icon(
                                painter = painterResource(id = R.drawable.baseline_arrow_circle_up_24),
                                contentDescription = null,
                                tint = Color.Green
                            )
                        }
                    }
                }
            }
        }
    }
}


@Composable
fun BottomBarAuctionDetail() {
    BottomAppBar(
        containerColor = MaterialTheme.colorScheme.primary,
        contentColor = MaterialTheme.colorScheme.onBackground,
        modifier = Modifier.clip(RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
    ) {
        Button(
            onClick = { /*TODO*/ },
            modifier = Modifier
                .fillMaxWidth()
                .padding(10.dp),
            shape = RoundedCornerShape(10.dp),
            colors = androidx.compose.material3.ButtonDefaults.buttonColors(
                containerColor = MaterialTheme.colorScheme.secondary,
                contentColor = MaterialTheme.colorScheme.onSecondary
            )
        ) {
            Text(text = "Place Bid")
        }
    }
}

@Composable
fun TopBarAuctionDetail(navController: NavController) {
    TopAppBar(
        title = {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(end = 50.dp)
                , contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Auction Details",
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
        backgroundColor = MaterialTheme.colorScheme.primary,
    )
}
