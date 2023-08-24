import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const header1 = screen.getByRole("heading", { name: /İletişim Formu/ });
  expect(header1).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const isimBilgisi = screen.getByTestId("ad");
  fireEvent.change(isimBilgisi, { target: { value: "abc" } });

  const nameError = screen.getByTestId("error-ad");
  expect(nameError).toBeInTheDocument();
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const btn = screen.getByRole("button", { name: /gönder/i });
  userEvent.click(btn);

  const hataMesajlari = await screen.findAllByTestId("error-message");
  expect(hataMesajlari).toHaveLength(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const isim = screen.getByLabelText(/ad/i);
  const soyisim = screen.getByLabelText(/soyad/i);
  userEvent.type(isim, "Şeyma");
  userEvent.type(soyisim, "Köse");

  const btn = screen.getByRole("button", { name: /gönder/i });
  userEvent.click(btn);

  const hataMesaj = await screen.findByTestId("email-error");
  expect(hataMesaj).toHaveTextContent("Geçerli bir email adresi giriniz.");
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const emailHata = screen.getByLabelText(/email/i);
  userEvent.type(emailHata, "invalidemail");

  const btn = screen.getByRole("button", { name: /gönder/i });
  userEvent.click(btn);

  const hataMesaj = await screen.findByTestId("email-error");
  expect(hataMesaj).toHaveTextContent("Geçerli bir email adresi giriniz.");
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const isim = screen.getByLabelText(/ad/i);
  userEvent.type(isim, "Şeyma");

  const emailHata = screen.getByLabelText(/email/i);
  userEvent.type(emailHata, "seymakose@gmail.com");

  const btn = screen.getByRole("button", { name: /gönder/i });
  userEvent.click(btn);

  const hataMesaj = await screen.findByTestId("soyad-error");
  expect(hataMesaj).toHaveTextContent("Soyad gereklidir.");
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const isim = screen.getByLabelText(/ad/i);
  userEvent.type(isim, "Şeyma");

  const soyisim = screen.getByLabelText(/soyad/i);
  userEvent.type(soyisim, "Köse");

  const emailHata = screen.getByLabelText(/email/i);
  userEvent.type(emailHata, "seymakose@gmail.com");

  const btn = screen.getByRole("button", { name: /gönder/i });
  userEvent.click(btn);

  await waitFor(() => {
    const hataMesajlari = screen.queryAllByTestId("error-message");
    expect(hataMesajlari).toHaveLength(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  const isim = screen.getByTestId(/ad/i);
  userEvent.type(isim, "Şeyma");

  const soyisim = screen.getByTestId(/soyad/i);
  userEvent.type(soyisim, "Köse");

  const emailHata = screen.getByTestId(/email/i);
  userEvent.type(emailHata, "seymakose@gmail.com");

  const mesaj1 = screen.getByTestId(/mesaj/i);
  userEvent.type(mesaj1, "Merhaba, bu bir test mesajıdır.");

  const btn = screen.getByRole("button", { name: /gönder/i });
  userEvent.click(btn);

  await waitFor(() => {
    const adSoyad = screen.getByTestId("ad-soyad");
    const email = screen.getByTestId("email");
    const mesaj = screen.getByTestId("mesaj");

    expect(adSoyad).toHaveTextContent("Şeyma Köse");
    expect(email).toHaveTextContent("seymakose@gmail.com");
    expect(mesaj).toHaveTextContent("Merhaba, bu bir test mesajıdır.");
  });
});
