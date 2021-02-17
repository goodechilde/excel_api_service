import Env from "@ioc:Adonis/Core/Env";

/**
 * @slynova/flydrive
 *
 * @license MIT
 * @copyright Slynova - Romain Lanz <romain.lanz@slynova.ch>
 */

export default {
  /*
   |--------------------------------------------------------------------------
   | Default Filesystem Disk
   |--------------------------------------------------------------------------
   */
  default: 'local',

  /*
   |--------------------------------------------------------------------------
   | Filesystem Disks
   |--------------------------------------------------------------------------
   |
   | Supported: "local", "s3"
   |
   */
  disks: {
    local: {
      driver: 'local',
      config: {
        root: process.cwd(),
      },
    },

    s3: {
      driver: 's3',
      config: {
        key: Env.get('AWS_S3_KEY', ''),
        secret: Env.get('AWS_S3_SECRET', ''),
        region: Env.get('AWS_S3_REGION', ''),
        bucket: Env.get('AWS_S3_BUCKET', ''),
      },
    },

    spaces: {
      driver: 's3',
      config: {
        key: 'SPACES_KEY',
        secret: 'SPACES_SECRET',
        endpoint: 'SPACES_ENDPOINT',
        bucket: 'SPACES_BUCKET',
        region: 'SPACES_REGION',
      },
    },

    gcs: {
      driver: 'gcs',
      config: {
        keyFilename: 'GCS_KEY',
        bucket: 'GCS_BUCKET',
      },
    },
  },
};
