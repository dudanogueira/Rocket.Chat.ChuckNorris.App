import { ISetting, SettingType} from '@rocket.chat/apps-engine/definition/settings';

export enum AppSetting {
    ChuckNorrisAppRemoveExplicit = 'chucknorris_remove_explicit',
}

export const settings: Array<ISetting> = [
    {
        id: AppSetting.ChuckNorrisAppRemoveExplicit,
        public: true,
        type: SettingType.BOOLEAN,
        value: true,
        packageValue: true,
        hidden: false,
        i18nLabel: 'ChuckNorris_Removeexplicit',
        required: false,
    },
]