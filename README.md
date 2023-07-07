# Laporan Penjelasan Algoritma Aplikasi Web Prediksi Cuaca
![preview](https://raw.githubusercontent.com/Taufik-H/regression-linear/main/image1.png)

### Demo
[Demo Link](https://regression-linear.vercel.app/)
## Deskripsi
Aplikasi web ini bertujuan untuk memprediksi cuaca besok berdasarkan data historis cuaca pada lokasi yang diinputkan oleh pengguna. Aplikasi ini menggunakan API dari WeatherAPI untuk mendapatkan data cuaca historis dan melakukan prediksi cuaca menggunakan algoritma regresi.

## Tools dan Algoritma yang Digunakan
Aplikasi web ini ditulis menggunakan library ReactJS dan menggunakan beberapa tools dan algoritma sebagai berikut:

1. **Axios**: Digunakan untuk melakukan HTTP request ke API WeatherAPI untuk mendapatkan data cuaca historis.
2. **Math.js**: Digunakan untuk melakukan operasi matematika, seperti perhitungan matriks dan perkalian matriks.

## Cara Kerja Aplikasi Web
Berikut adalah penjelasan proses kerja aplikasi web ini:

1. Pengguna memasukkan nama lokasi cuaca yang ingin diprediksi.
2. Saat pengguna mengklik tombol "Dapatkan Prediksi Cuaca", fungsi `fetchWeatherData` akan dijalankan.
3. Fungsi `fetchWeatherData` akan mengirim HTTP request ke WeatherAPI menggunakan Axios dengan URL yang telah dibentuk menggunakan lokasi yang dimasukkan pengguna dan kunci API cuaca.
4. Jika permintaan berhasil, data cuaca historis untuk 2 hari ke depan akan diperoleh dari respons API.
5. Data cuaca historis tersebut akan diproses dalam fungsi `applyRegressionAlgorithm`.
6. Fungsi `applyRegressionAlgorithm` akan melakukan algoritma regresi untuk memprediksi cuaca besok.
7. Data cuaca historis akan diubah menjadi format yang diperlukan untuk regresi, yaitu tanggal dalam bentuk timestamp dan suhu rata-rata harian.
8. Algoritma regresi menggunakan matriks dan operasi matematika untuk menghitung koefisien regresi.
9. Setelah mendapatkan koefisien regresi, aplikasi akan memprediksi suhu cuaca besok berdasarkan koefisien dan tanggal besok.
10. Selain itu, aplikasi juga menentukan kondisi cuaca berdasarkan suhu yang diprediksi.
11. Hasil prediksi dan hasil algoritma regresi akan disimpan dalam state aplikasi dan ditampilkan kepada pengguna.

## Proses Algoritma Regresi

Berikut adalah penjelasan langkah-langkah dalam algoritma regresi yang dijalankan dalam fungsi `applyRegressionAlgorithm`:

1. Data cuaca historis dipisahkan menjadi dua array, yaitu array tanggal dan array suhu rata-rata.
   - Menggunakan metode `map`, setiap elemen pada array tanggal diubah menjadi timestamp dengan `new Date(date).getTime()`.

2. Matriks `X` dibentuk dengan menggabungkan array tanggal yang telah diubah menjadi timestamp dengan tambahan kolom 1 pada setiap baris.
   - Menggunakan metode `map`, setiap elemen pada array timestamp diubah menjadi array baru dengan elemen pertama 1 dan elemen kedua adalah timestamp tersebut.

3. Matriks `X` ditranspose.
   - Menggunakan fungsi `math.transpose(X)` dari library Math.js untuk mentranspose matriks `X` dan menghasilkan matriks `XTranspose`.

4. Perhitungan matriks `XTX` dilakukan dengan mengalikan matriks `XTranspose` dengan matriks `X`.
   - Menggunakan fungsi `math.multiply(XTranspose, X)` untuk mengalikan kedua matriks tersebut, dan hasilnya disimpan dalam variabel `XTX`.

5. Perhitungan matriks `XTY` dilakukan dengan mengalikan matriks `XTranspose` dengan array suhu rata-rata.
   - Menggunakan fungsi `math.multiply(XTranspose, temps)` untuk mengalikan matriks `XTranspose` dengan array suhu, dan hasilnya disimpan dalam variabel `XTY`.

6. Selanjutnya, dilakukan perhitungan koefisien regresi dengan mengalikan invers matriks `XTX` dengan matriks `XTY`.
   - Menggunakan fungsi `math.inv(XTX)` untuk menghitung invers dari matriks `XTX`, dan fungsi `math.multiply(math.inv(XTX), XTY)` untuk mengalikan hasil invers dengan matriks `XTY`.
   - Hasil perkalian tersebut akan menghasilkan koefisien regresi, yang disimpan dalam variabel `coefficients`.

7. Setelah mendapatkan koefisien regresi, dilakukan prediksi suhu cuaca besok dengan menggunakan koefisien tersebut.
   - Pertama, tanggal besok diambil dan diubah menjadi timestamp dengan bantuan objek `Date`.
   - Kemudian, dibentuk vektor fitur untuk tanggal besok dengan nilai pertama 1 dan nilai kedua adalah timestamp tanggal besok.
   - Melalui perkalian vektor fitur dengan koefisien regresi menggunakan fungsi `math.multiply`, dihasilkan prediksi suhu cuaca besok yang disimpan dalam variabel `tomorrowTemp`.

8. Selain itu, terdapat logika tambahan untuk memprediksi kondisi cuaca berdasarkan suhu yang diprediksi.
   - Jika suhu diprediksi lebih besar atau sama dengan 25, maka kondisi cuaca dianggap "Cerah".
   - Jika suhu diprediksi lebih besar atau sama dengan 15, maka kondisi cuaca dianggap "Berawan".
   - Jika suhu diprediksi kurang dari 15, maka kondisi cuaca dianggap "Hujan".

9. Hasil koefisien regresi, suhu cuaca besok, dan kondisi cuaca besok disimpan dalam objek `regressionResult`.
   - Objek `regressionResult` memiliki properti berikut:
     - `coefficients`: Array koefisien regresi yang terdiri dari elemen pertama dan elemen kedua.
     - `tomorrowTemp`: Prediksi suhu cuaca besok yang dibulatkan hingga dua desimal.
     - `condition`: Kondisi cuaca besok berdasarkan prediksi suhu.

10. Objek `regressionResult` disimpan dalam state dengan menggunakan fungsi `setRegressionResult(regressionResult)`.

11. Hasil prediksi suhu cuaca besok dan kondisi cuaca besok ditampilkan pada tampilan aplikasi dalam bagian "Hasil Algoritma Regresi".

12. Jika terdapat hasil prediksi cuaca besok (`prediction`), hasil tersebut juga ditampilkan pada tampilan aplikasi.

Dengan menggunakan langkah-langkah di atas, algoritma regresi pada aplikasi ini mengolah data cuaca historis, menghitung koefisien regresi, melakukan prediksi suhu cuaca besok, dan menentukan kondisi cuaca berdasarkan prediksi suhu tersebut. Hal ini memungkinkan pengguna untuk mendapatkan prediksi cuaca besok berdasarkan data historis yang diperoleh dari API cuaca.



## Kesimpulan
Aplikasi web ini menggunakan ReactJS dan mengintegrasikan API WeatherAPI untuk memprediksi cuaca besok berdasarkan data historis cuaca. Algoritma regresi digunakan untuk melakukan prediksi suhu cuaca besok dengan memanfaatkan koefisien regresi yang dihitung dari data cuaca historis. Hasil prediksi dan hasil algoritma regresi ditampilkan kepada pengguna melalui antarmuka web yang responsif. Dengan demikian, pengguna dapat memperoleh prediksi cuaca yang dapat membantu perencanaan aktivitas mereka.
