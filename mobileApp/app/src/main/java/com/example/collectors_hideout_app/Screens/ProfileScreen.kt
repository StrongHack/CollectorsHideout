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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Card
import androidx.compose.material.DropdownMenuItem
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.KeyboardArrowLeft
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberTopAppBarState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.collectors_hideout_app.Main.BottomBar
import com.example.collectors_hideout_app.Main.Data.User.UserDetailViewModel
import com.example.collectors_hideout_app.R


@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(navController: NavController, userId: String) {

    val viewModel: UserDetailViewModel = viewModel()
    viewModel.fetchUserDetail(userId)

    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            val topAppBarState = rememberTopAppBarState()
            TopAppBar(
                title = {
                    Box(
                        modifier = Modifier.fillMaxWidth(),
                        contentAlignment = Alignment.Center
                    )
                    {
                        Text(
                            text = "Profile",
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
                    DropdownProfile()
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                ),
            )
        },
        bottomBar = {
            BottomBar(navController = navController)
        },
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
        ) {
            Row(
                modifier = Modifier
                    .weight(0.5f)
                    .padding(top = 64.dp)
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(bottomStart = 40.dp, bottomEnd = 40.dp))
                    .background(MaterialTheme.colorScheme.primary),
                horizontalArrangement = Arrangement.Center
            ) {
                UserCard(viewModel)
            }
            Row(
                modifier = Modifier
                    .weight(0.5f)
                    .padding(bottom = 50.dp)
                    .padding(horizontal = 20.dp)
                    .fillMaxWidth(),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(0.5f)
                ) {
                    CardItem("Favorites",
                        painterResource(id = R.drawable.baseline_favorite_24),
                        "Favorites",
                        navController,
                        "ShoppingCartScreen"
                    )
                    CardItem("Orders",
                        painterResource(id = R.drawable.baseline_shopping_bag_24),
                        "Orders",
                        navController,
                        "ShoppingCartScreen"

                    )
                    CardItem("Proposals",
                        painterResource(id = R.drawable.baseline_collections_24),
                        "Proposals",
                        navController,
                        "ShoppingCartScreen"
                    )
                }
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(0.5f)
                ) {
                    CardItem("Albums",
                        painterResource(id = R.drawable.baseline_newspaper_24),
                        "Albums",
                        navController,
                        "ShoppingCartScreen"
                    )
                    CardItem("Publications",
                        painterResource(id = R.drawable.baseline_collections_24),
                        "Publications",
                        navController,
                        "ShoppingCartScreen"
                    )
                    CardItem("Auctions",
                        painterResource(id = R.drawable.baseline_gavel_24),
                        "Auctions",
                        navController,
                        "AuctionsScreen"
                    )
                }
            }
        }
    }
}

@Composable
fun CardItem(title: String, painter: Painter? = null, contentDescription: String?, navController: NavController, navigateTo : String) {
    Card(
        modifier = Modifier
            .padding(10.dp)
            .clickable { navController.navigate(navigateTo) }
            .fillMaxWidth(),
        elevation = 4.dp
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.secondary)
                .padding(8.dp)
        ) {
            Icon(
                painter = painter!!,
                contentDescription = contentDescription!!,
                modifier = Modifier.size(35.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(5.dp))
            Text(
                text = title,
                color = Color.Black,
                fontSize = 15.sp,
                style = MaterialTheme.typography.labelSmall
            )
        }
    }
}

@Composable
fun DropdownProfile() {
    val context = LocalContext.current
    var expanded by remember { mutableStateOf(false) }

    IconButton(onClick = { expanded = !expanded }) {
        Icon(
            imageVector = Icons.Default.MoreVert,
            contentDescription = "More",
            tint = Color.White
        )
    }
    Box(
        modifier = Modifier
            .padding(end = 5.dp)
            .padding(top = 40.dp)
            .background(Color.White),
    ) {
        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
        ) {
            DropdownMenuItem(
                onClick = {
                }
            ) {
                Text(
                    text = "Editar Perfil",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onBackground
                )
            }
            DropdownMenuItem(onClick = {
            }) {
                Text(
                    text = "Logout",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onTertiary
                )
            }
        }
    }
}

@Composable
fun UserCard(viewModel: UserDetailViewModel) {

    val user = viewModel.user

    if (user != null) {
        Column(
            modifier = Modifier
                .fillMaxSize(1f),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            // Replace with your actual image
            Image(
                painter = painterResource(id = R.drawable.logo),
                contentDescription = "Profile",
                modifier = Modifier
                    .padding(bottom = 5.dp)
                    .size(170.dp)
                    .clip(RoundedCornerShape(100.dp))
                    .background(MaterialTheme.colorScheme.secondary)
            )
            Column(
                modifier = Modifier
                    .padding(5.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = user.userPersonalName,
                    modifier = Modifier
                        .padding(horizontal = 5.dp),
                    fontSize = 25.sp,
                    color = Color.White,
                    style = MaterialTheme.typography.titleLarge,
                    textAlign = TextAlign.Center,
                )
                Text(
                    text = "@${user.userUsername}",
                    modifier = Modifier
                        .padding(horizontal = 5.dp),
                    fontSize = 15.sp,
                    color = Color.White,
                    style = MaterialTheme.typography.titleLarge,
                    textAlign = TextAlign.Center,
                )
                Spacer(modifier = Modifier.height(5.dp))
                Text(
                    text = user.userEmail,
                    modifier = Modifier
                        .padding(horizontal = 5.dp),
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.secondary,
                    style = MaterialTheme.typography.labelSmall,
                )
            }
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(10.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Replace with your actual icons and numbers
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        painterResource(id = R.drawable.baseline_newspaper_24),
                        contentDescription = "Publications",
                        modifier = Modifier.size(30.dp),
                        tint = MaterialTheme.colorScheme.secondary
                    )
                    Text(
                        text = "1",
                        color = Color.White,
                        fontSize = 15.sp,
                        style = MaterialTheme.typography.labelSmall
                    )
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        painterResource(id = R.drawable.baseline_shopping_bag_24),
                        contentDescription = "Orders",
                        modifier = Modifier.size(30.dp),
                        tint = MaterialTheme.colorScheme.secondary
                    )
                    Text(
                        text = "2",
                        color = Color.White,
                        fontSize = 15.sp,
                        style = MaterialTheme.typography.labelSmall
                    )
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Filled.Favorite,
                        contentDescription = "Favorites",
                        modifier = Modifier.size(30.dp),
                        tint = Color(0xff941616)
                    )
                    Text(
                        text = "3",
                        color = Color.White,
                        fontSize = 15.sp,
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }
        }
    }
}


