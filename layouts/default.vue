<template>
  <div class="flex min-h-screen flex-col">
    <Header />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
    <Footer />
  </div>
</template>
