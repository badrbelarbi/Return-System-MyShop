<script>
 import {selectedProductsStore, userIdStore} from "../Store.js";
 import { onDestroy } from 'svelte';

 import {userEmail} from "../Store.js";

 export let showHeader = true;
 import router from 'page';
 import { onMount } from 'svelte';
 import page from 'page';
 let token = '';
 let userRole = '';
 let userId = '';
 let isLoggedIn = false;
 let email = '';

 onDestroy(() => {
  selectedProductsStore.set([]);
 });
 onMount(() => {
  const token = localStorage.getItem('token');
  isLoggedIn = !!token;
  if (token) {
   const payload = JSON.parse(atob(token.split('.')[1]));
   console.log(token);
   userRole = payload.role;
   email = payload.email;
   userEmail.set(email)
   console.log(userRole)
   userId = payload.id;
   console.log(userId)
   userIdStore.set(userId)
  }
 });

 $: if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  userRole = payload.role;
 }

 function navigateToReturnRequests() {
  console.log(userRole)

  if (userRole === 'controller') {
   page('/controller');
  } else {
  }
 }
 function navigateToControllerStock() {
  page('/controller/stock');
 }
 function logout(){
  window.location.href='/';
  localStorage.removeItem('token');
 }
</script>

<style>
 .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1vw;
  background-color: white;
 }

 .logo {
  width: 10vw;
  height: auto;
  max-width: 100%;
 }

 .nav-links {
  display: flex;
  gap: 1vw;
  list-style: none;
  margin: 0;
  padding: 0;
  margin-left: 35vw;
 }

 .nav-links li {
  font-size: 1em;
  margin-right: 1.5vw;
 }

 .nav-links a {
  text-decoration: none;
  color: #333;
 }

 .user-image {
  width: 4vw;
  height: auto;
  max-width: 100%;
  border-radius: 50%;
 }
</style>

{#if showHeader}
 <div class="header">
  <img class="logo" src="https://myshop.s3-external-3.amazonaws.com/shop6116500.images.logo-myshop.webp" alt="Logo">

  {#if isLoggedIn}
   <!-- Only show navigation links if the user is logged in -->
   <div>
    <ul class="nav-links">
     {#if userRole === 'controller'}
      <li><a href="javascript:void(0)" on:click={navigateToReturnRequests}>RETURN REQUESTS &nbsp; |</a></li>
      <li><a href="javascript:void(0)" on:click={navigateToControllerStock}>STOCK &nbsp; |</a></li>
     {:else if userRole === 'customer'}
      <!-- Show links for customers -->
      <li><a href="/client"  on:click(onDestroy)>Home &nbsp; |</a></li>
      <li><a href="/myOrders" on:click(onDestroy)>My Orders &nbsp; |</a></li>
      <li><a href="/myReturns"  on:click(onDestroy)>Return Requests</a></li>
     {:else if userRole === 'admin'}
      <!-- Show links for admin -->
      <li><a href="/admin">HOME &nbsp; |</a></li>
      <li><a href="/users">USERS &nbsp; |</a></li>
      <li><a href="/requests">RETURN REQUESTS &nbsp; |</a></li>
     {/if}
     <li><a href="#" on:click={logout}>LOGOUT</a></li>
    </ul>
   </div>
  {/if}

  <img class="user-image" src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png" alt="User Image">
 </div>
{/if}



