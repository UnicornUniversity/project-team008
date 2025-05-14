# HOW TO SETUP ARDUINO

To configure your Arduino project with your unique identifiers:

1. Create a file named `secrets.h` in your sketch folder.
2. Add the following lines, replacing the placeholders with your actual values:

```
#ifndef SECRETS_H
#define SECRETS_H

#define ARDUINO_ID    "your_arduino_id"
#define SECRET_KEY    "your_secret_key"

#endif
```

That's it—nothing more, nothing less. Save the file and build your sketch as usual.
