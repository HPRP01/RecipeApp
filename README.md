# RecipeApp
This application was developed as my final project for ECE1895 Junior Design at the University of Pittsburgh.

## Inspiration
While trying to think of ideas for my final project I was talking with some friends and one suggested an app that would allow us to share recipe ideas. The app is losely based on designs from photo sharing app Instagram as well as the exercise sharing app Strava. The app allows users to upload an image of a recipe they created along with a title and a description of the recipe itself. This description could either be the written version of the recipe or simply a link to a recipe found online. The user is also able to see a list of all users registered with the app and select which account they want to follow which in turn wil determine which posts are shown in their home feed. 

## Major Technologies Used
- Expo
- React
- React Native
- Firebase

I decided to use React Native as I wanted a way to develop a cross platform app without needing to write code twice. I also wanted to gain more experience using JavaScript as a programming language as it is very similar to what I am doing at my Co-Op assignment and I hope to continue working with it in the future. 

I also decided to use Expo as it made it much easier to rapidly prototype and test my application since I was able to run it directly on my phone with live updates when I changed my code. Rather than having to create a new build every time I was able to simply save the changes I made and see them appear in real time on my phone. 

## Packages Included
- React Navigation
  - This package is used to create the tab navigation for the 3 main pages as well as the stack navigation for the account screens. 
- React Native Vector Icons
  - This package is used for the icons that appear at the bottom of the screen to select tabs.
- Expo Image Picker
  - This package is used to enable the user to open the camera roll on their device and select the image they want to upload.


## Design
<p float="left">
  <img src="https://user-images.githubusercontent.com/55462701/205974664-99a88e37-a679-4851-9bf5-e0205c810e3b.PNG" width="180">
  <img src="https://user-images.githubusercontent.com/55462701/205974686-5caad530-ec8d-4257-b4db-d37b943b2b28.PNG" width="180">
  <img src="https://user-images.githubusercontent.com/55462701/205974816-08ce982b-8069-4b5b-a7e1-8f93930fe574.PNG" width="180">
  <img src="https://user-images.githubusercontent.com/55462701/205974829-69b9c984-7433-47d3-b24a-903d7aef6786.PNG" width="180">
  <img src="https://user-images.githubusercontent.com/55462701/205974855-9b50e07f-8d77-4bd4-8fee-3d049dba7724.PNG" width="180">
</p>

When the user launches the application they are met with a Login/Registration screen where they can either sign in to an existing account or create a new account. For ease of testing there is also a button to automatically sign in to the administrator account. This button will be removed in future iterations. 

Once the user has signed in they are greeted with three main pages. The first page is the Home page where they are able to see all of the recipes uploaded from other users that they follow and they are able to like a post. This page is sorted such that the newest post always appears at the top and has pull to refresh implemented so new posts can be loaded dynamically. 

The second page is the Post page where a user is able to create a recipe to upload. The user first selects an image that they want from the device's camera roll and they can then add a title a description of the recipe. When the user clicks upload the post is uploaded to the database and saved to their account. 

The third page is the Account page where a user can choose the accounts they follow, view their own posts, view liked posts, and sign out of their account. 

## How it Works
### Creating Account

### Signing in to Account

### Loading Home Feed

### Following a User

### Displaying Individual User Uploads

## Testing


## What I Learned
During the development of this application I learned a lot about what goes into the building of an app. One of the major issues I ran into was the dependencies changing between different versions of packages. I had a lot of problems with compatability between packages and when reading through support forums often found that I needed to revert the version from the most updated for certain packages to work properly. 

After completing this project I feel much more confident in my JavaScript skills as well as my ability to rapidly prototype and design a moblie application. 

## Potential Future Improvements
In the future I would like to add a way for users to search for account to follow rather than selecting from a list. I would also like to find a better way to compress and resize images before uploading them which will decrease the amount of time required to load images in the home feed as well as decreae total storage used and bandwidth sent to the Firebase Firestore.
