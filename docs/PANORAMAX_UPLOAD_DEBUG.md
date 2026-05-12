# Panoramax upload debugging notes

## Summary

I am using my own PHP code to upload prepared JPEG files to Panoramax. The official Panoramax website is only opened afterwards for checking `/your-pictures`.

## Current API calls

```text
POST /api/upload_sets
POST /api/upload_sets/<uuid>/files
POST /api/upload_sets/<uuid>/complete
```

## Main question

Is this route correct?

```text
POST /api/upload_sets/<uuid>/files
```

Or should the code use this route instead?

```text
POST /api/upload_sets/<uuid>/items
```

## Observed behavior

- Upload set seems to be created.
- File transfer seems to start.
- Panoramax sometimes reports that a file was rejected or that a server error occurred.
- The images do not reliably appear under `/your-pictures`.

## Notes

The console errors from the official Panoramax website may come from manual testing in the website frontend. The main code path in this repository is the PHP API upload.
