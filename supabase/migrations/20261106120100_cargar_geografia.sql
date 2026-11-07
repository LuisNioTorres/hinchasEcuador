-- Fase 1: carga de continentes, provincias y cantones.
-- Base: lista de INEC de 2012 (221 cantones), con tildes y sin abreviaturas.
-- La Concordia pasa de Esmeraldas a Santo Domingo de los Tsáchilas (Asamblea Nacional, 2013).
-- Sevilla Don Bosco se agrega a Morona Santiago (Asamblea Nacional, 2024).
-- Las zonas no delimitadas no se incluyen porque no son cantones.

insert into public.continentes (nombre) values
  ('América del Norte'),
  ('América del Sur'),
  ('Europa'),
  ('Asia'),
  ('África'),
  ('Oceanía'),
  ('Antártida');

insert into public.provincias (nombre, codigo_iso) values
  ('Azuay', 'EC-A'),
  ('Bolívar', 'EC-B'),
  ('Cañar', 'EC-F'),
  ('Carchi', 'EC-C'),
  ('Chimborazo', 'EC-H'),
  ('Cotopaxi', 'EC-X'),
  ('El Oro', 'EC-O'),
  ('Esmeraldas', 'EC-E'),
  ('Galápagos', 'EC-W'),
  ('Guayas', 'EC-G'),
  ('Imbabura', 'EC-I'),
  ('Loja', 'EC-L'),
  ('Los Ríos', 'EC-R'),
  ('Manabí', 'EC-M'),
  ('Morona Santiago', 'EC-S'),
  ('Napo', 'EC-N'),
  ('Orellana', 'EC-D'),
  ('Pastaza', 'EC-Y'),
  ('Pichincha', 'EC-P'),
  ('Santa Elena', 'EC-SE'),
  ('Santo Domingo de los Tsáchilas', 'EC-SD'),
  ('Sucumbíos', 'EC-U'),
  ('Tungurahua', 'EC-T'),
  ('Zamora Chinchipe', 'EC-Z');

insert into public.cantones (provincia_id, nombre)
select p.id, c.nombre
from (values
  ('Azuay', 'Cuenca'), ('Azuay', 'Girón'), ('Azuay', 'Gualaceo'), ('Azuay', 'Nabón'),
  ('Azuay', 'Paute'), ('Azuay', 'Pucará'), ('Azuay', 'San Fernando'), ('Azuay', 'Santa Isabel'),
  ('Azuay', 'Sígsig'), ('Azuay', 'Oña'), ('Azuay', 'Chordeleg'), ('Azuay', 'El Pan'),
  ('Azuay', 'Sevilla de Oro'), ('Azuay', 'Guachapala'), ('Azuay', 'Camilo Ponce Enríquez'),

  ('Bolívar', 'Guaranda'), ('Bolívar', 'Chillanes'), ('Bolívar', 'Chimbo'),
  ('Bolívar', 'Echeandía'), ('Bolívar', 'San Miguel'), ('Bolívar', 'Caluma'),
  ('Bolívar', 'Las Naves'),

  ('Cañar', 'Azogues'), ('Cañar', 'Biblián'), ('Cañar', 'Cañar'), ('Cañar', 'La Troncal'),
  ('Cañar', 'El Tambo'), ('Cañar', 'Déleg'), ('Cañar', 'Suscal'),

  ('Carchi', 'Tulcán'), ('Carchi', 'Bolívar'), ('Carchi', 'Espejo'), ('Carchi', 'Mira'),
  ('Carchi', 'Montúfar'), ('Carchi', 'San Pedro de Huaca'),

  ('Cotopaxi', 'Latacunga'), ('Cotopaxi', 'La Maná'), ('Cotopaxi', 'Pangua'),
  ('Cotopaxi', 'Pujilí'), ('Cotopaxi', 'Salcedo'), ('Cotopaxi', 'Saquisilí'),
  ('Cotopaxi', 'Sigchos'),

  ('Chimborazo', 'Riobamba'), ('Chimborazo', 'Alausí'), ('Chimborazo', 'Colta'),
  ('Chimborazo', 'Chambo'), ('Chimborazo', 'Chunchi'), ('Chimborazo', 'Guamote'),
  ('Chimborazo', 'Guano'), ('Chimborazo', 'Pallatanga'), ('Chimborazo', 'Penipe'),
  ('Chimborazo', 'Cumandá'),

  ('El Oro', 'Machala'), ('El Oro', 'Arenillas'), ('El Oro', 'Atahualpa'), ('El Oro', 'Balsas'),
  ('El Oro', 'Chilla'), ('El Oro', 'El Guabo'), ('El Oro', 'Huaquillas'), ('El Oro', 'Marcabelí'),
  ('El Oro', 'Pasaje'), ('El Oro', 'Piñas'), ('El Oro', 'Portovelo'), ('El Oro', 'Santa Rosa'),
  ('El Oro', 'Zaruma'), ('El Oro', 'Las Lajas'),

  ('Esmeraldas', 'Esmeraldas'), ('Esmeraldas', 'Eloy Alfaro'), ('Esmeraldas', 'Muisne'),
  ('Esmeraldas', 'Quinindé'), ('Esmeraldas', 'San Lorenzo'), ('Esmeraldas', 'Atacames'),
  ('Esmeraldas', 'Rioverde'),

  ('Guayas', 'Guayaquil'), ('Guayas', 'Alfredo Baquerizo Moreno'), ('Guayas', 'Balao'),
  ('Guayas', 'Balzar'), ('Guayas', 'Colimes'), ('Guayas', 'Daule'), ('Guayas', 'Durán'),
  ('Guayas', 'El Empalme'), ('Guayas', 'El Triunfo'), ('Guayas', 'Milagro'),
  ('Guayas', 'Naranjal'), ('Guayas', 'Naranjito'), ('Guayas', 'Palestina'),
  ('Guayas', 'Pedro Carbo'), ('Guayas', 'Samborondón'), ('Guayas', 'Santa Lucía'),
  ('Guayas', 'Salitre'), ('Guayas', 'San Jacinto de Yaguachi'), ('Guayas', 'Playas'),
  ('Guayas', 'Simón Bolívar'), ('Guayas', 'Coronel Marcelino Maridueña'),
  ('Guayas', 'Lomas de Sargentillo'), ('Guayas', 'Nobol'),
  ('Guayas', 'General Antonio Elizalde'), ('Guayas', 'Isidro Ayora'),

  ('Imbabura', 'Ibarra'), ('Imbabura', 'Antonio Ante'), ('Imbabura', 'Cotacachi'),
  ('Imbabura', 'Otavalo'), ('Imbabura', 'Pimampiro'), ('Imbabura', 'San Miguel de Urcuquí'),

  ('Loja', 'Loja'), ('Loja', 'Calvas'), ('Loja', 'Catamayo'), ('Loja', 'Celica'),
  ('Loja', 'Chaguarpamba'), ('Loja', 'Espíndola'), ('Loja', 'Gonzanamá'), ('Loja', 'Macará'),
  ('Loja', 'Paltas'), ('Loja', 'Puyango'), ('Loja', 'Saraguro'), ('Loja', 'Sozoranga'),
  ('Loja', 'Zapotillo'), ('Loja', 'Pindal'), ('Loja', 'Quilanga'), ('Loja', 'Olmedo'),

  ('Los Ríos', 'Babahoyo'), ('Los Ríos', 'Baba'), ('Los Ríos', 'Montalvo'),
  ('Los Ríos', 'Puebloviejo'), ('Los Ríos', 'Quevedo'), ('Los Ríos', 'Urdaneta'),
  ('Los Ríos', 'Ventanas'), ('Los Ríos', 'Vinces'), ('Los Ríos', 'Palenque'),
  ('Los Ríos', 'Buena Fe'), ('Los Ríos', 'Valencia'), ('Los Ríos', 'Mocache'),
  ('Los Ríos', 'Quinsaloma'),

  ('Manabí', 'Portoviejo'), ('Manabí', 'Bolívar'), ('Manabí', 'Chone'), ('Manabí', 'El Carmen'),
  ('Manabí', 'Flavio Alfaro'), ('Manabí', 'Jipijapa'), ('Manabí', 'Junín'), ('Manabí', 'Manta'),
  ('Manabí', 'Montecristi'), ('Manabí', 'Paján'), ('Manabí', 'Pichincha'),
  ('Manabí', 'Rocafuerte'), ('Manabí', 'Santa Ana'), ('Manabí', 'Sucre'), ('Manabí', 'Tosagua'),
  ('Manabí', '24 de Mayo'), ('Manabí', 'Pedernales'), ('Manabí', 'Olmedo'),
  ('Manabí', 'Puerto López'), ('Manabí', 'Jama'), ('Manabí', 'Jaramijó'),
  ('Manabí', 'San Vicente'),

  ('Morona Santiago', 'Morona'), ('Morona Santiago', 'Gualaquiza'),
  ('Morona Santiago', 'Limón Indanza'), ('Morona Santiago', 'Palora'),
  ('Morona Santiago', 'Santiago'), ('Morona Santiago', 'Sucúa'),
  ('Morona Santiago', 'Huamboya'), ('Morona Santiago', 'San Juan Bosco'),
  ('Morona Santiago', 'Taisha'), ('Morona Santiago', 'Logroño'),
  ('Morona Santiago', 'Pablo Sexto'), ('Morona Santiago', 'Tiwintza'),
  ('Morona Santiago', 'Sevilla Don Bosco'),

  ('Napo', 'Tena'), ('Napo', 'Archidona'), ('Napo', 'El Chaco'), ('Napo', 'Quijos'),
  ('Napo', 'Carlos Julio Arosemena Tola'),

  ('Pastaza', 'Pastaza'), ('Pastaza', 'Mera'), ('Pastaza', 'Santa Clara'), ('Pastaza', 'Arajuno'),

  ('Pichincha', 'Quito'), ('Pichincha', 'Cayambe'), ('Pichincha', 'Mejía'),
  ('Pichincha', 'Pedro Moncayo'), ('Pichincha', 'Rumiñahui'),
  ('Pichincha', 'San Miguel de los Bancos'), ('Pichincha', 'Pedro Vicente Maldonado'),
  ('Pichincha', 'Puerto Quito'),

  ('Tungurahua', 'Ambato'), ('Tungurahua', 'Baños de Agua Santa'), ('Tungurahua', 'Cevallos'),
  ('Tungurahua', 'Mocha'), ('Tungurahua', 'Patate'), ('Tungurahua', 'Quero'),
  ('Tungurahua', 'San Pedro de Pelileo'), ('Tungurahua', 'Santiago de Píllaro'),
  ('Tungurahua', 'Tisaleo'),

  ('Zamora Chinchipe', 'Zamora'), ('Zamora Chinchipe', 'Chinchipe'),
  ('Zamora Chinchipe', 'Nangaritza'), ('Zamora Chinchipe', 'Yacuambi'),
  ('Zamora Chinchipe', 'Yantzaza'), ('Zamora Chinchipe', 'El Pangui'),
  ('Zamora Chinchipe', 'Centinela del Cóndor'), ('Zamora Chinchipe', 'Palanda'),
  ('Zamora Chinchipe', 'Paquisha'),

  ('Galápagos', 'San Cristóbal'), ('Galápagos', 'Isabela'), ('Galápagos', 'Santa Cruz'),

  ('Sucumbíos', 'Lago Agrio'), ('Sucumbíos', 'Gonzalo Pizarro'), ('Sucumbíos', 'Putumayo'),
  ('Sucumbíos', 'Shushufindi'), ('Sucumbíos', 'Sucumbíos'), ('Sucumbíos', 'Cascales'),
  ('Sucumbíos', 'Cuyabeno'),

  ('Orellana', 'Orellana'), ('Orellana', 'Aguarico'), ('Orellana', 'La Joya de los Sachas'),
  ('Orellana', 'Loreto'),

  ('Santo Domingo de los Tsáchilas', 'Santo Domingo'),
  ('Santo Domingo de los Tsáchilas', 'La Concordia'),

  ('Santa Elena', 'Santa Elena'), ('Santa Elena', 'La Libertad'), ('Santa Elena', 'Salinas')
) as c (provincia, nombre)
join public.provincias p on p.nombre = c.provincia;

-- Si algún total no coincide, la migración completa se cancela.
do $$
begin
  if (select count(*) from public.continentes) <> 7 then
    raise exception 'Se esperaban 7 continentes';
  end if;
  if (select count(*) from public.provincias) <> 24 then
    raise exception 'Se esperaban 24 provincias';
  end if;
  if (select count(*) from public.cantones) <> 222 then
    raise exception 'Se esperaban 222 cantones';
  end if;
end;
$$;
