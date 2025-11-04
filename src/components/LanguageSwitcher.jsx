import { useTranslation } from 'react-i18next'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import TranslateIcon from '@mui/icons-material/Translate';
export default function LanguageSwitcher(){
  const { i18n, t } = useTranslation()
  const value = i18n.language
  const handle = (_, lang) => { if (!lang) return; i18n.changeLanguage(lang); localStorage.setItem('lang', lang) }
  return (<ToggleButtonGroup size='small' value={value} exclusive onChange={handle} aria-label={t('language')}>
      <ToggleButton value='en'><TranslateIcon fontSize='small'/> EN</ToggleButton>
      <ToggleButton value='hi'>हिंदी</ToggleButton>
    </ToggleButtonGroup>)
}
