# Module for Arduino: 4×3 Keyboard (12 Keys) with AVR

## Hardware Overview

- **Controller:** Arduino UNO R3 with an attached WiFi module (e.g., ESP8266) for wireless communication.
- **Input Device:** 4×3 keypad (12 buttons) connected to Arduino digital input pins.
- **Additional Components:** Power supply and auxiliary circuits (such as pull-up resistors) to ensure stable signal reading from the keypad.

## Software Overview

- **Keypad Input Handling:**  
  The firmware on the Arduino continuously monitors the keypad and assembles the pressed keys into a PIN code.

- **PIN Code Hashing:**  
  Once the complete PIN code is entered, the Arduino hashes the code (for example, using SHA-256) to secure the input by ensuring that the actual PIN is never transmitted over the network.

- **Verification:**  
  The resulting hash is compared against a pre-stored reference hash to verify the correctness of the entered PIN.

- **WiFi Communication:**  
  Upon successful hash verification, the Arduino initiates a WiFi connection with a PC or server.

- **Document Download:**  
  A corresponding application on the PC or server authenticates the received request and, if valid, downloads a document from cloud storage, handling it as needed.

This design integrates simple keypad input processing, local hash-based security, and wireless communication to facilitate secure access to cloud-stored documents.
