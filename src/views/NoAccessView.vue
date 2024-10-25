<script setup>

</script>

<template>
  <div class="no-access-page">
    <div class="no-access-content">
      <h1>⚠️ 權限不足</h1>
      <p>您沒有訪問此頁面的權限。請聯繫管理員以獲取更多資訊。</p>
      <router-link to="/" class="back-to-home">返回頁面</router-link>
    </div>
  </div>
</template>

<style scoped>
.no-access-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.no-access-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.no-access-content h1 {
  font-size: 2.5rem;
  color: #e74c3c;
  margin-bottom: 20px;
}

.no-access-content p {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 30px;
}

.back-to-home {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.back-to-home:hover {
  background-color: #2980b9;
}
</style>
