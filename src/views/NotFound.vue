<template>
    <div class="page">
        <div class="text-center">
            <h1 class="display-1 text-danger">404</h1>
            <h2>Trang không tìm thấy</h2>
            <p class="lead">Rất tiếc, trang bạn tìm không tồn tại hoặc đã bị xóa.</p>
            <router-link to="/" class="btn btn-primary mt-3">Quay về trang chủ</router-link>
        </div>
    </div>
</template>

<style scoped>
.page {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.display-1 {
    font-size: 6rem;
    font-weight: bold;
}
</style>