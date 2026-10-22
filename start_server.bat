@echo off
title ShopAI Backend Server & Database
chcp 65001 >nul
echo ========================================================
echo       KHỞI ĐỘNG SERVER & DATABASE CHO ỨNG DỤNG SHOPAI
echo ========================================================
echo.

:: 1. Chuyển tiếp cổng qua cáp USB nếu điện thoại đang cắm máy tính
where adb >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [*] Đang chuyển tiếp cổng 3000 qua cáp USB (adb reverse)...
    adb reverse tcp:3000 tcp:3000 >nul 2>&1
    echo [OK] Đã kích hoạt cổng USB localhost:3000.
) else (
    echo [!] Không tìm thấy adb (điện thoại vẫn kết nối bình thường qua Wi-Fi).
)

echo.
echo [*] Địa chỉ kết nối Backend:
echo     • USB / Cáp:   http://localhost:3000
echo     • Mạng Wi-Fi:  http://10.10.42.115:3000
echo     • Swagger API: http://localhost:3000/api/docs
echo.
echo [*] Đang khởi động NestJS Backend & Database SQLite...
echo     (Giữ cửa sổ này mở trong khi sử dụng App trên điện thoại)
echo.

cd /d "%~dp0shopai-backend"
npm run start:dev
