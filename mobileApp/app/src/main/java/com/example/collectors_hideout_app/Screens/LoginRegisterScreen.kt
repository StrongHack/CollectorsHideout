package com.example.collectors_hideout_app.Screens

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.TabRowDefaults.SecondaryIndicator
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.collectors_hideout_app.R

/**
 * Composable function for the screen containing sign-in and registration content.
 */
@Composable
fun LoginRegisterScreen(navController: NavController) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        LoginRegisterContent(navController)
    }
}

/**
 * Composable function for the content of the sign-in and registration screen.
 */
@Composable
fun LoginRegisterContent(navController: NavController) {
    var selectedTabIndex by remember { mutableIntStateOf(0) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(top = 50.dp)
            .padding(16.dp)
            .background(MaterialTheme.colorScheme.background),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Spacer(modifier = Modifier.height(5.dp))
        Logo()

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp)
                .verticalScroll(rememberScrollState()),
        ) {
            TabRow(
                containerColor = MaterialTheme.colorScheme.background,
                selectedTabIndex = selectedTabIndex,
                divider = { },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                indicator = { tabPositions ->
                    SecondaryIndicator(
                        Modifier
                            .tabIndicatorOffset(tabPositions[selectedTabIndex])
                            .padding(horizontal = 30.dp)
                            .padding(top = 17.dp),
                        color = MaterialTheme.colorScheme.primary,
                    )
                }

            ) {
                Tab(
                    selected = selectedTabIndex == 0,
                    onClick = { selectedTabIndex = 0 },
                    modifier = Modifier.padding(vertical = 7.dp)
                ) {
                    Text(
                        text = "Log in",
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onBackground,
                    )
                }
                Tab(
                    selected = selectedTabIndex == 1,
                    onClick = { selectedTabIndex = 1 },
                    modifier = Modifier.padding(vertical = 7.dp)
                ) {
                    Text(
                        text = "Sign in",
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onBackground,
                    )
                }
            }

            // Content below the tabs
            when (selectedTabIndex) {
                0 -> LoginContent(navController)
                1 -> RegisterContent(navController)
            }

            // Center and place SocialMediaLoginOptions() below the container
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                horizontalArrangement = Arrangement.Center
            ) {
                SocialMediaLoginOptions()
            }
        }
    }
}

/**
 * Composable function for the login content.
 */
@Composable
fun LoginContent(navController: NavController) {
    val context = LocalContext.current
    var loginAttempted by remember { mutableStateOf(false) }


    TextField(
        value = "Manel",
        onValueChange = { },
        placeholder = { Text("Email", color = MaterialTheme.colorScheme.onBackground) },
        modifier = Modifier
            .padding(horizontal = 10.dp, vertical = 8.dp)
            .fillMaxWidth(),
        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next)
    )

    // Password TextField
    TextField(
        value = "123456",
        onValueChange = { },
        placeholder = { Text("Password", color = MaterialTheme.colorScheme.onBackground) },
        visualTransformation = PasswordVisualTransformation(),
        modifier = Modifier
            .padding(horizontal = 10.dp, vertical = 8.dp)
            .fillMaxWidth(),
        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next)
    )

    Spacer(modifier = Modifier.height(5.dp))

    Text(
        text = "Fogot your password?",
        color = MaterialTheme.colorScheme.primary,
        style = MaterialTheme.typography.labelSmall,
        modifier = Modifier
            .padding(horizontal = 9.dp)
            .clickable { }
    )

    Spacer(modifier = Modifier.height(10.dp))

    LoginButton {
        navController.navigate("AuctionsScreen")
        Toast.makeText(context, "Login Successful", Toast.LENGTH_SHORT).show()
    }
}

/**
 * Composable function for the registration content.
 */
@Composable
fun RegisterContent(navController: NavController) {
    var context = LocalContext.current

    TextField(
        value = "Manel",
        onValueChange = { },
        placeholder = { Text("Name", color = MaterialTheme.colorScheme.onBackground) },
        modifier = Modifier
            .padding(horizontal = 10.dp, vertical = 8.dp)
            .fillMaxWidth(),
        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next)
    )

    TextField(
        value = "Manel@manel.com",
        onValueChange = {},
        placeholder = { Text("Email", color = MaterialTheme.colorScheme.onBackground) },
        modifier = Modifier
            .padding(horizontal = 10.dp, vertical = 8.dp)
            .fillMaxWidth(),
        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next)
    )

    // Password TextField
    TextField(
        value = "*****",
        onValueChange = { },
        placeholder = { Text("Password", color = MaterialTheme.colorScheme.onBackground) },
        visualTransformation = PasswordVisualTransformation(),
        modifier = Modifier
            .padding(horizontal = 10.dp, vertical = 8.dp)
            .fillMaxWidth(),
        // You might want to add VisualTransformation for hiding password
        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next)
    )

    // Phone TextField
    TextField(
        value = "9155",
        onValueChange = {},
        placeholder = {
            Text(
                "Phone Number",
                color = MaterialTheme.colorScheme.onBackground
            )
        },
        modifier = Modifier
            .padding(horizontal = 10.dp, vertical = 8.dp)
            .fillMaxWidth(),
        keyboardOptions = KeyboardOptions(
            imeAction = ImeAction.Done,
            keyboardType = KeyboardType.Phone
        )
    )

    Spacer(modifier = Modifier.height(8.dp))

    RegisterButton {
        navController.navigate("AuctionsScreen")
        Toast.makeText(context, "Registration Successful", Toast.LENGTH_SHORT).show()
    }
}

/**
 * Composable function for displaying the logo and title of the app.
 */
@Composable
fun Logo() {
    // The logo for the app.
    Image(
        painter = painterResource(id = R.drawable.logo),
        contentDescription = null,
        modifier = Modifier
            .padding(bottom = 15.dp)
            .size(150.dp)

    )
}

/**
 * Composable function for social media login options.
 */
@Composable
fun SocialMediaLoginOptions() {
    Row(horizontalArrangement = Arrangement.spacedBy(100.dp)) {
        SocialMediaIcon(R.drawable.ic_google, "Login with Google") { /*TODO: Handle Google login*/ }
        SocialMediaIcon(
            R.drawable.ic_facebook,
            "Login with Facebook"
        ) { /*TODO: Handle Facebook login*/ }
    }
}

/**
 * Composable function for social media icons.
 *
 * @param drawableId Resource ID of the drawable icon.
 * @param contentDescription Description for the icon content.
 * @param onClick Callback for the click action on the icon.
 */
@Composable
fun SocialMediaIcon(drawableId: Int, contentDescription: String, onClick: () -> Unit) {
    Image(
        painter = painterResource(id = drawableId),
        contentDescription = contentDescription,
        modifier = Modifier
            .size(48.dp)
            .clickable(onClick = onClick)
    )
}

/**
 * Composable function for the login button.
 *
 * @param onClick Callback for the click action on the button.
 */
@Composable
fun LoginButton(onClick: () -> Unit) {
    Button(
        onClick = onClick,
        modifier = Modifier
            .padding(16.dp)
            .fillMaxWidth(),
        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
        shape = MaterialTheme.shapes.medium,
        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
    ) {
        Text(
            "Login",
            fontSize = 18.sp,
            color = Color.White,
            modifier = Modifier.padding(vertical = 8.dp)
        )
    }
}

/**
 * Composable function for the registration button.
 *
 * @param onClick Callback for the click action on the button.
 */
@Composable
fun RegisterButton(onClick: () -> Unit) {
    Button(
        onClick = onClick,
        modifier = Modifier
            .padding(16.dp)
            .fillMaxWidth(),
        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
        shape = MaterialTheme.shapes.medium,
        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
    ) {
        Text(
            "Register",
            fontSize = 18.sp,
            color = Color.White,
            modifier = Modifier.padding(vertical = 8.dp)
        )
    }
}
