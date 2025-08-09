# Microsoft Converged Sign-In Page

the files in this directory are a adapted version of the converged sign-in page from Microsoft.

- `signin.tsx`: Extracted sign-in page, converted to tsx using https://transform.tools/html-to-jsx. some additional adjustments were made to allow it to work nicely with the rest of the app.
- `signin.css`: Original CSS from the Microsoft sign-in page. Included as-is.

the pages were fetched on the 22nd of July 2025 from a login initiated from office.com.

## Isn't it dangerous to publish this

well, to some degree yes.
by publishing this code, i'm somewhat lowering the barrier to entry for people who want to create convincing phishing pages.

however, i believe that anyone with the skills to integrate this code into some phishing campaing - thus creating a backend etc. for it - would have no trouble creating the frontend themselves.
so realistically, this only saves a hour or two of work for someone who wants to go the malicious route.
