import { Modal, type App } from 'obsidian'

/**
 * Edits a node's text in Obsidian's own dialog. On a phone, a text box inside the board fights the on-screen keyboard for
 * focus (the keyboard flickers open and shut), while a dialog is what Obsidian itself uses for typing on mobile.
 */
export class EditTextModal extends Modal {
  constructor(app: App, private readonly text: string, private readonly onSubmit: (text: string) => void) {
    super(app)
  }

  onOpen() {
    this.setTitle('Edit node text')
    const box = this.contentEl.createEl('textarea', { cls: 'flowmap-edit-text', text: this.text })
    box.rows = 5
    const buttons = this.contentEl.createDiv({ cls: 'modal-button-container' })
    buttons.createEl('button', { text: 'Save', cls: 'mod-cta' }).addEventListener('click', () => {
      this.onSubmit(box.value)
      this.close()
    })
    buttons.createEl('button', { text: 'Cancel' }).addEventListener('click', () => this.close())
    window.setTimeout(() => { box.focus(); box.setSelectionRange(box.value.length, box.value.length) }, 50)
  }

  onClose() {
    this.contentEl.empty()
  }
}
