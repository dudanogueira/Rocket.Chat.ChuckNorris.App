import { ISetting, SettingType} from '@rocket.chat/apps-engine/definition/settings';

export enum AppSetting {
    ChuckNorrisAppUrl = 'chucknorris_url',
    ChuckNorrisAppRemoveExplicit = 'chucknorris_remove_explicit',
}

export const settings: Array<ISetting> = [
    {
        id: AppSetting.ChuckNorrisAppUrl,
        public: true,
        type: SettingType.STRING,
        value: "https://api.chucknorris.io/",
        packageValue: "https://api.chucknorris.io/",
        hidden: false,
        i18nLabel: 'ChuckNorris_URL',
        required: false,
    },    
    {
        id: AppSetting.ChuckNorrisAppRemoveExplicit,
        public: true,
        type: SettingType.BOOLEAN,
        value: true,
        packageValue: true,
        hidden: false,
        i18nLabel: 'ChuckNorris_Removeexplicit',
        required: false,
    }
    
]