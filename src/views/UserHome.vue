<template>
  <div class="page">
    <!-- Tiêu đề -->
    <div class="hero-section text-center">
      <h1>Chào mừng bạn đến với Trang Web đăng ký mượn sách</h1>
      <p>Khám phá, mượn sách và tận hưởng thế giới sách.</p>
    </div>

    <!-- Các khối thông tin -->
    <div class="info-section">
      <div class="row">
        <div class="col-md-4">
          <div class="info-card">
            <div class="icon">📚</div>
            <h3>Số lượng sách lớn</h3>
            <p>Truy cập hàng ngàn cuốn sách thuộc nhiều thể loại và chủ đề khác nhau.</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="info-card">
            <div class="icon">⏰</div>
            <h3>Truy cập 24/7</h3>
            <p>Đăng ký mượn và trả sách mọi lúc, mọi nơi.</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="info-card">
            <div class="icon">👥</div>
            <h3>Cộng đồng lớn</h3>
            <p>Giao lưu, chia sẻ và học hỏi từ cộng đồng đam mê sách.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-center mt-5">
      <p>&copy; B2105973 - Trần Phước Lộc - 2025</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'UserHome',
};
</script>

<style scoped>
.page {
  padding: 20px;
  background-color: #f0f4f8;
  min-height: 100vh;
}

.hero-section {
  padding: 50px 0;
  background-color: #e6f4ea;
  border-radius: 10px;
  margin-bottom: 30px;
}

.hero-section h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.hero-section p {
  font-size: 1.2rem;
  color: #7f8c8d;
}

.info-section {
  padding: 20px 0;
}

.info-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  height: 100%;
}

.info-card .icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.info-card h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #2c3e50;
}

.info-card p {
  color: #7f8c8d;
}

footer {
  padding: 20px 0;
  background-color: #e6f4ea;
  border-radius: 10px;
}

footer p {
  margin: 0;
  color: #7f8c8d;
}
</style>