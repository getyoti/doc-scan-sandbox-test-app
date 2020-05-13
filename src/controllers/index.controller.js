const config = require('../../config');

const {
  DocScanClient,
  SessionSpecificationBuilder,
  RequestedDocumentAuthenticityCheckBuilder,
  RequestedTextExtractionTaskBuilder,
  RequestedLivenessCheckBuilder,
  RequestedFaceMatchCheckBuilder,
  SdkConfigBuilder,
  DocScanConstants,
} = require('yoti');

/**
 * Create a Doc Scan session.
 */
async function createSession(req) {
  const docScanClient = new DocScanClient(
    config.YOTI_CLIENT_SDK_ID,
    config.YOTI_PEM
  );

  const sessionSpec = new SessionSpecificationBuilder()
    .withClientSessionTokenTtl(600)
    .withResourcesTtl(90000)
    .withUserTrackingId('some-user-tracking-id')
    .withRequestedCheck(
      new RequestedDocumentAuthenticityCheckBuilder()
        .build()
    )
    .withRequestedTask(
      new RequestedTextExtractionTaskBuilder()
        .withManualCheckAlways()
        .build()
    )
    .withSdkConfig(
      new SdkConfigBuilder()
        .withAllowsCameraAndUpload()
        .withPrimaryColour('#2d9fff')
        .withSecondaryColour('#FFFFFF')
        .withFontColour('#FFFFFF')
        .withLocale('en-GB')
        .withPresetIssuingCountry('GBR')
        .withSuccessUrl(`${config.YOTI_APP_BASE_URL}/success`)
        .withErrorUrl(`${config.YOTI_APP_BASE_URL}/error`)
        .build()
    );

  if (req.query.checks) {
    const requestedChecks = req.query.checks.split(',');

    if (requestedChecks.includes(DocScanConstants.ZOOM)) {
      sessionSpec.withRequestedCheck(
        new RequestedLivenessCheckBuilder()
          .forZoomLiveness()
          .build()
      );
    }

    if (requestedChecks.includes(DocScanConstants.ID_DOCUMENT_FACE_MATCH)) {
      sessionSpec.withRequestedCheck(
        new RequestedFaceMatchCheckBuilder()
          .withManualCheckFallback()
          .build()
      );
    }
  }

  return docScanClient.createSession(sessionSpec.build());
}

module.exports = async (req, res) => {
  try {
    const session = await createSession(req);

    req.session.DOC_SCAN_SESSION_ID = session.getSessionId();
    req.session.DOC_SCAN_SESSION_TOKEN = session.getClientSessionToken();

    res.render('pages/index', {
      iframeUrl: `${config.YOTI_DOC_SCAN_IFRAME_URL}?sessionID=${req.session.DOC_SCAN_SESSION_ID}&sessionToken=${req.session.DOC_SCAN_SESSION_TOKEN}`,
    });
  } catch (error) {
    res.render('pages/error', { error });
  }
};
