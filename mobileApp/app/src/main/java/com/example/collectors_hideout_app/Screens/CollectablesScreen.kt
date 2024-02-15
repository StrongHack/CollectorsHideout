package com.example.collectors_hideout_app.Screens

import android.annotation.SuppressLint
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.Surface
import androidx.compose.material.TopAppBar
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.NavigationDrawerItemDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
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
import com.example.collectors_hideout_app.Main.BottomBar
import com.example.collectors_hideout_app.Main.CollectableItem
import com.example.collectors_hideout_app.Main.collectablesStockList
import com.example.collectors_hideout_app.Main.collectionsModalNavigationDrawer
import kotlinx.coroutines.launch

@Composable
fun CollectablesScreen(navController: NavController) {
    Surface(
        modifier = Modifier.fillMaxSize(),

        ) {
        CollectablesListScreen(navController)
    }
}

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@Composable
fun CollectablesListScreen(navController: NavController) {

    Scaffold {
        CollectablesContent(navController)
    }
}

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@Composable
fun CollectablesContent(navController: NavController) {

    var selectedCollectionIndex by rememberSaveable {
        mutableStateOf(0)
    }
    var selectedCollection by rememberSaveable { mutableStateOf(collectionsModalNavigationDrawer.first()) }

    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    val searchQuery = remember { mutableStateOf("") }

    // Modal to navigate between collections
    ModalNavigationDrawer(
        scrimColor = MaterialTheme.colorScheme.background, drawerContent = {
            ModalDrawerSheet {
                Spacer(modifier = Modifier.height(30.dp))

                // List of collections to navigate
                collectionsModalNavigationDrawer.forEachIndexed { index, collection ->
                    NavigationDrawerItem(
                        label = { Text(text = collection) },
                        selected = index == selectedCollectionIndex,
                        onClick = {
                            selectedCollectionIndex = index
                            selectedCollection = collectionsModalNavigationDrawer[index]
                            scope.launch {
                                drawerState.close()
                            }
                        },
                        modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding)
                    )
                }

                Spacer(modifier = Modifier.weight(1f))

                Text(
                    "Filter by Price",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(start = 16.dp)
                )

                // Row contendo dois OutlinedTextField lado a lado
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // min price text box
                    OutlinedTextField(
                        value = "",
                        onValueChange = {},
                        label = { Text("Min Price") },
                        keyboardOptions = KeyboardOptions.Default.copy(keyboardType = KeyboardType.Number),
                        modifier = Modifier
                            .weight(1f)
                            .padding(16.dp)
                    )


                    Spacer(modifier = Modifier.width(16.dp))

                    // max price text box
                    OutlinedTextField(
                        value = "",
                        onValueChange = {},
                        label = { Text("Max Price") },
                        keyboardOptions = KeyboardOptions.Default.copy(keyboardType = KeyboardType.Number),
                        modifier = Modifier
                            .weight(1f)
                            .padding(16.dp)
                    )
                }
                // Apply Filter Button
                Button(
                    onClick = {
                        scope.launch {
                            drawerState.close()
                        }
                    }, modifier = Modifier
                        .fillMaxWidth()
                        .padding(start = 16.dp, end = 16.dp, bottom = 16.dp)
                        .background(MaterialTheme.colorScheme.primary),
                    colors = ButtonDefaults.buttonColors(
                        contentColor = Color.White
                    )
                ) {
                    Text("Apply Filter", fontSize = 16.sp)
                }

            }
        }, drawerState = drawerState
    ) {
        Scaffold(modifier = Modifier.fillMaxSize(), topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Collections",
                        fontSize = 21.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        style = MaterialTheme.typography.titleLarge,
                        color = Color.White,
                        modifier = Modifier.padding(horizontal = 70.dp)
                    )
                },
                navigationIcon = {
                    // Button to open modal drawer
                    IconButton(onClick = {
                        scope.launch { drawerState.open() }
                    }) {
                        Icon(
                            imageVector = Icons.Default.Menu,
                            contentDescription = "Collections",
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
        }, content = {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)

            ) {
                // Search Bar
                OutlinedTextField(
                    value = searchQuery.value,
                    onValueChange = { searchQuery.value = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 40.dp)
                        .clip(RoundedCornerShape(5.dp)),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = Color.White,
                        unfocusedContainerColor = Color.White,
                        disabledContainerColor = Color.White,
                    ),
                    label = { Text("Search") },
                    singleLine = true,
                    trailingIcon = {
                        Icon(
                            Icons.Filled.Search, contentDescription = "Search Icon"
                        )
                    },
                )

                Spacer(modifier = Modifier.height(16.dp))

                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(color = MaterialTheme.colorScheme.background)
                ) {
                    items(collectablesStockList.filter { collectable ->
                        val filterCollection = selectedCollection
                        collectable.collection == filterCollection
                    }) { content ->
                        Spacer(modifier = Modifier.height(10.dp))

                        CollectableCard(navController, content)
                    }
                }
            }
        }, bottomBar = {
            // BottomBar to navigate between screens
            BottomBar(
                navController = navController
            )
        })
    }
}

@Composable
fun CollectableCard(navController: NavController, item: CollectableItem) {
    Row(
        modifier = Modifier
            .padding(bottom = 10.dp)
            .padding(10.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 17.dp, end = 17.dp,start = 17.dp)
                .clickable {navController.navigate("CollectableDetailsScreen/${item.id}")}
        ) {
            // Load and display the image
            Image(
                painter = painterResource(id = item.image),
                contentDescription = item.name,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .height(300.dp)
                    .width(300.dp)
                    .clip(RoundedCornerShape(12.dp))
            )

            Spacer(modifier = Modifier.height(5.dp))

            // Display the product name
            Text(
                text = item.name,
                style = MaterialTheme.typography.titleLarge,
                color = MaterialTheme.colorScheme.onBackground,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                fontSize = 25.sp
            )

            Spacer(modifier = Modifier.height(4.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Product Details Column
                Column(
                    modifier = Modifier.weight(1f), horizontalAlignment = Alignment.Start
                ) {

                    // Display the product stock
                    Text(
                        text = "Stock: ${item.stock}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onBackground,
                        maxLines = 1,
                        fontSize = 17.sp
                    )

                    Spacer(modifier = Modifier.height(8.dp))
                    //Display price product
                    Text(
                        text = "${String.format("%.2f", item.price)}€",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onBackground,
                        maxLines = 1,
                        fontSize = 17.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                }
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
            ) {
                // Add to favorites button
                Button(
                    onClick = { /* TODO: Add action for the button click */ },
                    modifier = Modifier
                        .weight(0.3f)
                        .fillMaxWidth()
                        .height(50.dp)
                        .clip(RoundedCornerShape(topStart = 50.dp, bottomStart = 50.dp))
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
                        .clip(RoundedCornerShape(topEnd = 50.dp, bottomEnd = 50.dp))
                        .background(MaterialTheme.colorScheme.primary),
                    colors = ButtonDefaults.buttonColors(
                        contentColor = Color.White
                    )
                ) {
                    Text("Add to Cart", fontSize = 17.sp)
                }
            }
        }
    }
}
