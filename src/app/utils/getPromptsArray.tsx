import arrayBufferToString from './arrayBufferToString';

export default function getPromptsArray(promptFile: File): Promise<string[]> {
  // Get a list of string splitted by '\n'
  return new Promise((resolve, reject) => {
    if (promptFile?.size === 0) resolve([]);

    const fileReader = new FileReader();
    let promptsArray: string[];

    fileReader.onload = (event) => {
      let prompts = event!.target!.result;
      if (prompts instanceof ArrayBuffer) {
        prompts = arrayBufferToString(prompts);
      }

      promptsArray = prompts!.split('\n');

      promptsArray = promptsArray.filter((str) => {
        return str.trim().length !== 0;
      });

      resolve(promptsArray);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };

    fileReader.readAsText(promptFile);
  });
}
