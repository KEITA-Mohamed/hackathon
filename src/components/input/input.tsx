'use client';


import './input.scss';
import {useSignals} from '@preact/signals-react/runtime';
import {
    currentModel,
    userInput,
    response,
    loading,
    promptLeft,
    modelMessages,
    totalsByModelByUser,
    currentConvId, isSaveModalOpen, // 👈 le signal qui stocke la conversation active
} from '@/signals/chatSignals';
import Message from '@/components/message/message';
import { MouseEventHandler } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

export default function Input() {
    useSignals();

    const handleClickSend = async () => {
        const question = userInput.value.trim();
        if (!question) {
            return
        }
        ;


        loading.value = true;
        response.value = '';
        userInput.value = '';

        const model = currentModel.value;
        modelMessages.value = {
            ...modelMessages.value,
            [model]: [
                ...(modelMessages.peek()[model] ?? []),
                <Message key={Date.now()} name="Moi" text={question} user={true}/>,
            ],
        };

        try {

            const res = await fetch(`/api/models/${model}`, {
                method: 'POST',
                credentials: 'include',              // JWT cookie
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    prompt: question,
                    convId: currentConvId.value,       // 👈 important !
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? 'Erreur back-end');

            currentConvId.value = data.convId;

            response.value = data.response;
            promptLeft.value -= 1;

            modelMessages.value = {
                ...modelMessages.value,
                [model]: [
                    ...modelMessages.peek()[model],
                    <Message
                        key={Date.now()}
                        name={model}
                        text={data.response}
                        user={false}
                    />,
                ],
            };

            await refreshTokens();
        } catch (err) {
            console.error('Erreur requête IA :', err);
        } finally {
            loading.value = false;
        }
    };


    const refreshTokens = async () => {
        try {
            const res = await fetch('/api/token/getTokensByModelByUser', {
                credentials: 'include',
            });
            if (!res.ok) throw new Error(await res.text());

            const json: Record<string, number> = await res.json();
            totalsByModelByUser.value = json;
        } catch (err) {
            console.error('Erreur lors de la mise à jour des crédits :', err);
        }
    };

    const handleClickOpenModal: MouseEventHandler<HTMLButtonElement> = () => {
        isSaveModalOpen.value = true;
        console.log("coucou")
    };


    return (
        <div id="prompt-container">
            {/* Sélecteur de modèle (mistral / gemini / …) */}
            <div id="select-container">
                {['mistral', 'gemini', 'deepseek'].map((model) => (
                    <button
                        key={model}
                        onClick={() => (currentModel.value = model)}
                        className={`model-btn ${
                            currentModel.value === model ? 'active-model' : ''
                        }`}
                    >
                        {model}
                    </button>
                ))}
            </div>


            <div id="input-container">
                <input
                    placeholder="Sélectionnez un modèle 👆 puis tapez votre prompt ici."
                    type="text"
                    value={loading.value ? '' : userInput.value}
                    readOnly={loading.value}                 // empêche de taper pendant la réponse
                    onChange={(e) => {
                        if (!loading.value) userInput.value = e.target.value;
                    }}
                    onKeyDown={(e) => {
                        if (!loading.value && e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleClickSend();
                        }
                    }}
                />

                <button
                    onClick={handleClickSend}
                    disabled={loading.value || !userInput.value.trim()}
                    className={
                        loading.value || !userInput.value.trim()
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }
                >
                    {loading.value ? '…' : <img src="./send.svg" alt="send"/>}
                </button>
                <button onClick={handleClickOpenModal}>
                    enregistrer
                </button>
                <Dialog open={isSaveModalOpen.value} onOpenChange={(v) => (isSaveModalOpen.value = v)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Enregistrer la conversation</DialogTitle>
                            <DialogDescription>
                                Souhaitez-vous enregistrer cette conversation avant de la quitter ?
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <DialogClose asChild>
                                <button
                                    className="bg-gray-300 px-4 py-2 rounded"
                                    onClick={() => (isSaveModalOpen.value = false)}
                                >
                                    Annuler
                                </button>
                            </DialogClose>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => {
                                    // 👇 appelle ici une fonction pour enregistrer
                                    console.log("Enregistrement lancé");
                                    isSaveModalOpen.value = false;
                                }}
                            >
                                Confirmer
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

        </div>
    );
}
