# 🗄️ كيفاش تشوف الجداول في MySQL و phpMyAdmin

## الطريقة 1: عبر API (الأسهل) ✅

أسهل طريقة - مباشرة من المتصفح:

### شوف جميع التبرعات:
```
http://127.0.0.1:8000/api/donations
```

### شوف جميع الفئات:
```
http://127.0.0.1:8000/api/donation-categories
```

### شوف جميع المستخدمين:
```
http://127.0.0.1:8000/api/users
```

### شوف جميع الآراء:
```
http://127.0.0.1:8000/api/testimonials
```

---

## الطريقة 2: phpMyAdmin (الطريقة الرسمية)

### الخطوات:

1. **افتح المتصفح:**
   ```
   http://localhost/phpmyadmin
   أو
   http://127.0.0.1/phpmyadmin
   ```

2. **تسجيل الدخول:**
   - Username: `root`
   - Password: (فارغة)
   - Host: `localhost`
   - اضغط **Login**

3. **اختر Database:**
   - من الجانب الأيسر اضغط على **laravel**

4. **اختر الجدول:**
   - **donations** (التبرعات)
   - **donation_categories** (الفئات)
   - **users** (المستخدمين)
   - **testimonials** (الآراء)
   - **articles** (المقالات)
   - **impact_statics** (الإحصائيات)

---

## الطريقة 3: MySQL Command Line

### إذا MySQL مثبت على جهازك:

1. **افتح Command Prompt أو PowerShell**

2. **اتصل بـ MySQL:**
   ```bash
   mysql -u root -p
   ```
   ثم ادخل كلمة المرور (أو اتركها فارغة)

3. **اختر Database:**
   ```sql
   USE laravel;
   ```

4. **شوف الجداول:**
   ```sql
   SHOW TABLES;
   ```

5. **شوف البيانات:**
   
   **جميع التبرعات:**
   ```sql
   SELECT * FROM donations;
   ```

   **جميع الفئات:**
   ```sql
   SELECT * FROM donation_categories;
   ```

   **جميع المستخدمين:**
   ```sql
   SELECT * FROM users;
   ```

   **جميع الآراء:**
   ```sql
   SELECT * FROM testimonials;
   ```

6. **احسب المجموع:**
   ```sql
   SELECT SUM(amount) as total FROM donations;
   ```

7. **ابحث عن تبرعات معينة:**
   ```sql
   SELECT * FROM donations WHERE donor_name = 'Aya';
   ```

---

## الطريقة 4: MySQL Workbench

إذا عندك MySQL Workbench مثبت:

1. **افتح MySQL Workbench**
2. **اتصل بـ localhost:3306**
3. **Username:** root
4. **Database:** laravel
5. **اختر الجدول اللي تبي تشوفه**

---

## معلومات الاتصال (Connection Info)

```
Host: 127.0.0.1 أو localhost
Port: 3306
Username: root
Password: (فارغة أو كلمة مرور إذا عندك)
Database: laravel
```

---

## البيانات الموجودة حالياً:

### Donations (التبرعات): 5
```
1. Ahmed Hassan - 100 DH - Medical Aid
2. Fatima Ali - 250 DH - Food & Water
3. Aya lahrayri - 250 DH - Medical Aid
4. Aya lahrayri - 250 DH - Food & Water
5. Aya lahrayri - 250 DH - Food & Water
```
**المجموع: 1000 DH**

### Categories (الفئات): 5
```
1. Medical Aid
2. Food & Water
3. Shelter
4. Education
5. General Support
```

### Users (المستخدمين): 1
```
1. Test User (test@example.com)
```

### Testimonials (الآراء): 2
```
1. Sarah Johnson - 5 ⭐
2. Mohammed Rahman - 5 ⭐
```

---

## ✅ الخلاصة

| الطريقة | المميزات | التطبيق |
|--------|---------|---------|
| **API** | ✅ أسهل، مباشر من المتصفح | http://127.0.0.1:8000/api/donations |
| **phpMyAdmin** | ✅ واجهة بصرية، سهلة | http://localhost/phpmyadmin |
| **MySQL CLI** | ✅ قوية، SQL مباشر | Command Line |
| **MySQL Workbench** | ✅ احترافية، رسوم بيانية | Desktop App |

---

## 🔍 أكثر الطرق استخداماً:

**للمبتدئين:** استخدم **API** - الأسهل
**للمحترفين:** استخدم **phpMyAdmin** أو **MySQL CLI**

**كل البيانات آمنة و محفوظة في MySQL!** ✅
