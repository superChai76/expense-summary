function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function f(id: string, value: string): string {
  return `${id}${pad2(value.length)}${value}`;
}

function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function generatePromptPayPayload(
  phone: string,
  amount: number
): string {
  let formattedPhone = phone.replace(/[^0-9]/g, "");
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "66" + formattedPhone.substring(1);
  }

  const merchantAccount =
    f("00", "A000000677010111") + f("01", formattedPhone);

  let payload = f("00", "01");
  payload += f("01", "12");
  payload += f("29", merchantAccount);
  payload += f("53", "764");
  payload += f("54", amount.toFixed(2));
  payload += f("58", "TH");
  payload += "6304";

  const crc = crc16(payload);
  payload += crc;

  return payload;
}
